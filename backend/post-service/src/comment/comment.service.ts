import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Comment, CommentDocument } from '../common/entities/comment.entity';
import { KafkaService } from 'src/kafka/config.kafka';
import { CreateCommentDto } from 'src/common/dto/comment/create';
import { UpdateCommentDto } from 'src/common/dto/comment/update';
import { ReplyCommentDto } from 'src/common/dto/comment/reply';
import { ApiResponse } from 'src/common/types/api-resp';
import { PostService } from 'src/post/post.service';
import { AuthorInforResp } from 'src/common/types/post-resp';
import { LikeService } from 'src/like/like.service';
import { CommentResp, RootCommentResp } from 'src/common/types/comment-resp';
import { Pagination } from 'src/common/types/pagination-resp';

@Injectable()
export class CommentService {
  constructor(
    @Inject(forwardRef(() => LikeService))
    private readonly like: LikeService,

    private readonly kafkaClient: KafkaService,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(dto: CreateCommentDto): Promise<ApiResponse<Comment>> {
    const { file, userId, postId, content, tag } = dto;

    const comment = new this.commentModel({
      userId,
      postId,
      content,
      tag: tag ?? null,
      file: file ?? null,
      isEdit: false,
      isRoot: true,
    });
    await comment.save();
    return {
      statusCode: 200,
      message: 'create comment successfully',
      data: comment,
    };
  }

  async update(dto: UpdateCommentDto): Promise<ApiResponse<boolean>> {
    const { commentId, file, content, tag } = dto;
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new HttpException(
        `Comment not found: ${commentId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (content !== undefined) {
      comment.content = content;
    }

    if (tag !== undefined) {
      comment.tag = tag;
    }

    if (file !== undefined) {
      comment.file = file;
    }

    comment.isEdit = true;
    await comment.save();
    return {
      statusCode: 200,
      message: 'update comment successfully',
      data: true,
    };
  }
  //
  async delete(id: string): Promise<ApiResponse<boolean>> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment not found: ${id}`);
    }

    if (comment.file) {
      this.kafkaClient.emit('comment-delete', comment.file);
    }

    await comment.deleteOne();
    return {
      statusCode: 200,
      message: 'delete comment successfully',
      data: true,
    };
  }
  //
  async reply(dto: ReplyCommentDto): Promise<ApiResponse<Comment>> {
    const { isRoot, reply, content, userId, postId, tag, file } = dto;
    const root = await this.commentModel.findById(reply).exec();
    if (!root) {
      throw new NotFoundException('comment not found');
    }
    if (!root.isRoot) {
      throw new ConflictException('comment is not root');
    }
    const replyComment = new this.commentModel({
      reply,
      isRoot: isRoot,
      content,
      userId,
      postId,
      tag,
      file,
    });
    await replyComment.save();

    return {
      statusCode: 200,
      message: 'Reply comment successfully',
      data: replyComment,
    };
  }
  //
  async deletePost(postId: string): Promise<ApiResponse<boolean>> {
    await this.commentModel.deleteMany({ postId }).exec();
    return {
      statusCode: 200,
      message: 'delete comment on a post successfully',
      data: true,
    };
  }
  //
  async getCommentRoot(
    postId: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<RootCommentResp>> {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { postId: postId, isRoot: true } },
      {
        $addFields: {
          rootIdAsString: { $toString: '$_id' },
        },
      },

      {
        $lookup: {
          from: 'comments',
          localField: 'rootIdAsString',
          foreignField: 'reply',
          as: 'replies',
        },
      },

      {
        $lookup: {
          from: 'likes',
          let: { commentIdStr: '$rootIdAsString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$targetId', '$$commentIdStr'] },
                    { $eq: ['$targetType', 'comment'] },
                  ],
                },
              },
            },
            { $count: 'total' },
          ],
          as: 'likeData',
        },
      },

      {
        $addFields: {
          replyCount: { $size: '$replies' },
          totalLike: {
            $ifNull: [{ $arrayElemAt: ['$likeData.total', 0] }, 0],
          },
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          replies: 0,
          rootIdAsString: 0,
          likeData: 0,
        },
      },
    ];

    const [comments, total] = await Promise.all([
      this.commentModel.aggregate(pipeline as any[]).exec(),
      this.commentModel.countDocuments({ postId, isRoot: true }).exec(),
    ]);

    const newResp = comments.map(
      (c) =>
        new CommentResp(
          c as Comment,
          c.totalLike as number,
          c.replyCount as number,
        ),
    );

    const pagination = new Pagination(total, page, limit);
    const RootComment = new RootCommentResp(newResp, pagination);

    return {
      statusCode: 200,
      message: 'Get comment with post id successfully !',
      data: RootComment,
    };
  }
  //
  async getReplyComment(
    parentCommentId: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<RootCommentResp>> {
    if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
      throw new NotFoundException('Parent comment ID không hợp lệ');
    }

    const parentIdObj = new mongoose.Types.ObjectId(parentCommentId);

    const skip = (page - 1) * limit;

    const pipeline: mongoose.PipelineStage[] = [
      { $match: { reply: parentIdObj } },

      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          pipeline: [
            { $project: { _id: 0, id: '$_id', username: 1, avatar: 1 } },
          ],
          as: 'userId',
        },
      },

      {
        $unwind: { path: '$userId', preserveNullAndEmptyArrays: true },
      },

      { $addFields: { commentIdStr: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'likes',
          let: { commentId: '$commentIdStr' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$targetId', '$$commentId'] },
                    { $eq: ['$targetType', 'comment'] },
                  ],
                },
              },
            },
            { $count: 'total' },
          ],
          as: 'likeData',
        },
      },

      {
        $addFields: {
          totalLike: { $ifNull: [{ $arrayElemAt: ['$likeData.total', 0] }, 0] },
        },
      },
      {
        $project: {
          likeData: 0,
          commentIdStr: 0,
        },
      },
    ];

    const [replies, total] = await Promise.all([
      this.commentModel.aggregate(pipeline).exec(),

      this.commentModel.countDocuments({ reply: parentIdObj }).exec(),
    ]);
    const newResp = replies.map(
      (c) => new CommentResp(c, c.totalLike as number, 0),
    );

    const pagination = new Pagination(total, page, limit);
    const RootComment = new RootCommentResp(newResp, pagination);

    return {
      statusCode: 200,
      message: 'get replies comment successfully !',
      data: RootComment,
    };
  }
  async total(postId: string): Promise<number> {
    return await this.commentModel.countDocuments({ postId }).exec();
  }

  async getAuthorInfo(postId: string): Promise<AuthorInforResp> {
    const comment = await this.commentModel.findById(postId).exec();
    if (!comment) {
      throw new NotFoundException('Post does not exist');
    }
    return {
      authorId: comment.userId.toString(),
      caption: comment.content,
    };
  }
}
