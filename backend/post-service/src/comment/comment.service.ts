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
import { AuthorInforResp } from '../common/dto/response/author.resp';
import { KafkaService } from 'src/kafka/config.kafka';
import { CreateCommentDto } from 'src/common/dto/comment/create';
import { UpdateCommentDto } from 'src/common/dto/comment/update';
import { ReplyCommentDto } from 'src/common/dto/comment/reply';
import { apiResponse } from 'src/common/types/api-resp';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @Inject(forwardRef(() => PostService))
    private readonly post: PostService,

    private readonly kafkaClient: KafkaService,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) { }

  async create(dto: CreateCommentDto): Promise<apiResponse<Comment>> {

    const { file, userId, postId, content, tag } = dto;

    const comment = new this.commentModel({
      userId,
      postId,
      content,
      tag: tag ?? null,
      file: file ?? null,
      isEdit: false,
      isRoot : true,
    });
    await comment.save();
    return { statusCode: 200, message: "create comment successfully", data: comment };
  }

  async update(dto: UpdateCommentDto): Promise<apiResponse<boolean>> {
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
    return { statusCode: 200, message: "update comment successfully", data: true };

  }
  //
  async delete(id: string): Promise<apiResponse<boolean>> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment not found: ${id}`);
    }

    if (comment.file) {
      this.kafkaClient.emitMessage('comment-delete', comment.file);
    }

    await comment.deleteOne();
    return { statusCode: 200, message: "delete comment successfully", data: true };
  }
  //
  async reply(dto: ReplyCommentDto): Promise<apiResponse<Comment>> {
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

    return { statusCode: 200, message: "Reply comment successfully", data: replyComment };
  }
  //
  async deletePost(postId: string) {
    await this.commentModel.deleteMany({ postId }).exec();
    return;
  }
  //
  async getCommentRoot(postId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { postId: postId, isRoot: true } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'reply',
          as: 'replies',
        },
      },
      {
        $addFields: {
          replyCount: { $size: '$replies' },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          replies: 0,
        },
      },
    ];

    const [comments, total] = await Promise.all([
      this.commentModel.aggregate(pipeline as any[]).exec(),
      this.commentModel.countDocuments({ postId, isRoot: true }).exec(),
    ]);

    return {
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //
  async getReplyComment(parentCommentId: string, page = 1, limit = 10) {
    
    if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
      throw new NotFoundException('Parent comment ID không hợp lệ');
    }
    const parentIdObj = new mongoose.Types.ObjectId(parentCommentId);

    const skip = (page - 1) * limit;

    const [replies, total] = await Promise.all([
      this.commentModel
        .find({ reply: parentIdObj })
        .populate({
          path: 'userId',
          select: 'id username avatar',
        })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ reply: parentIdObj }).exec(),
    ]);

    return {
      data: replies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async total(postId: string): Promise<number> {
    return await this.commentModel.countDocuments({ postId }).exec();
  }
  // retrun user infor owner post
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
