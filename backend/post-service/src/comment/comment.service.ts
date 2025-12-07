import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
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
import { AuthorInforResp } from 'src/common/types/post-resp';
import { LikeService } from 'src/like/like.service';
import {
  CommentNotify,
  CommentResp,
  RootCommentResp,
} from 'src/common/types/comment-resp';
import { Pagination } from 'src/common/types/pagination-resp';
import { TargetType } from 'src/common/enums/targetType.enum';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @Inject(forwardRef(() => LikeService))
    private readonly like: LikeService,

    @Inject(forwardRef(() => PostService))
    private readonly post: PostService,

    private readonly kafka: KafkaService,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  //
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
    this.kafka.emit('file-published', [file?.fileId]);
    const authorId = (await this.post.getAuthorInfo(comment.postId)).authorId;
    const commentNotify = new CommentNotify(comment , content, authorId);
    this.kafka.emit('comment-post', commentNotify);
    return {
      statusCode: 200,
      message: 'create comment successfully',
      data: comment,
    };
  }
  //
  async update(dto: UpdateCommentDto): Promise<ApiResponse<boolean>> {
    const { commentId, file, content, tag } = dto;

    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new HttpException(
        `Comment not found: ${commentId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const oldFile = comment.file;
    const oldFileId = oldFile?.fileId;

    if (content !== undefined) {
      comment.content = content;
    }
    if (tag !== undefined) {
      comment.tag = tag;
    }

    const newFileProvided = file !== undefined;
    const fileIdChanged = newFileProvided && file.fileId !== oldFileId;

    if (fileIdChanged) {
      comment.file = file;
    }

    comment.isEdit = true;

    try {
      await comment.save();
    } catch (dbError) {
      this.logger.error(`Failed to save updated comment: ${dbError.message}`);
      throw new HttpException(
        'Database error while updating comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (fileIdChanged) {
      try {
        await this.kafka.emit('file-published', [file.fileId]);
      } catch (kafkaError) {
        this.logger.error(
          `CRITICAL: DB saved, but 'file-published' event failed for file ${file.fileId}
          . Rolling back comment. Error: ${kafkaError.message}`,
        );
        comment.file = oldFile;
        try {
          await comment.save();
          this.logger.log(
            `Successfully rolled back file for comment ${commentId}`,
          );
        } catch (rollbackError) {
          this.logger.error(
            `CRITICAL_FAILURE: Failed to rollback comment ${commentId}.
             DB is inconsistent. Manual intervention required.`,
          );
        }

        throw new HttpException(
          'Failed to publish new file, change was rolled back.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    if (oldFileId && fileIdChanged) {
      try {
        this.kafka.emit('comment-delete', [oldFileId]);
      } catch (kafkaError) {
        this.logger.warn(
          `Comment updated, but failed to emit 'comment-delete' for old file ${oldFileId}.
           This file is now an orphan. Error: ${kafkaError.message}`,
        );
      }
    }
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
      this.kafka.emit('comment-delete', comment.file);
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
    this.kafka.emit('file-published', [file?.fileId]);
    const authorId = (await this.post.getAuthorInfo(replyComment.postId)).authorId;

    const commentNotify = new CommentNotify(replyComment , content,postId);
    this.kafka.emit('reply-comment', commentNotify);
    return {
      statusCode: 200,
      message: 'Reply comment successfully',
      data: replyComment,
    };
  }
  //
  async deleteAllCommentsForPost(
    postId: string,
  ): Promise<ApiResponse<boolean>> {
    let fileIdsToDelete: string[] = [];
    let commentIdsToDelete: string[] = [];

    try {
      const comments = await this.commentModel
        .find({ postId: postId }, { 'file.fileId': 1, _id: 1 })
        .exec();

      commentIdsToDelete = comments.map((comment) => comment._id.toString());

      fileIdsToDelete = comments
        .map((comment) => comment.file?.fileId)
        .filter((fileId): fileId is string => !!fileId);
    } catch (findError) {
      this.logger.error(
        `Failed to find comments/files for post ${postId}: ${findError.message}`,
      );
      throw new HttpException(
        'Failed to find comments for deletion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (fileIdsToDelete.length > 0) {
      try {
        this.kafka.emit('file-delete', fileIdsToDelete);
        this.logger.log(
          `Emitted 'file-delete' event for ${fileIdsToDelete.length} files from post ${postId}`,
        );
      } catch (kafkaError) {
        this.logger.warn(
          `Failed to emit 'file-delete' event for post ${postId}. Files may be orphaned. Error: ${kafkaError.message}`,
        );
      }
    }

    if (commentIdsToDelete.length > 0) {
      try {
        await this.like.deleteLikesByTarget(
          commentIdsToDelete,
          TargetType.COMMENT,
        );
      } catch (likeError) {
        this.logger.warn(
          `Failed to delete associated comment likes for post ${postId}. Error: ${likeError.message}`,
        );
      }
    }

    try {
      const deleteResult = await this.commentModel
        .deleteMany({ postId })
        .exec();

      this.logger.log(
        `Successfully deleted ${deleteResult.deletedCount} comments for post ${postId}`,
      );

      return {
        statusCode: 200,
        message: 'delete comment on a post successfully',
        data: true,
      };
    } catch (deleteError) {
      this.logger.error(
        `Failed to delete comments for post ${postId}: ${deleteError.message}`,
      );
      throw new HttpException(
        'Failed to delete comments for the post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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


    const skip = (page - 1) * limit;

    const pipeline: mongoose.PipelineStage[] = [
      { $match: { reply: parentCommentId } },

      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit },
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

      this.commentModel.countDocuments({ reply: parentCommentId }).exec(),
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
  //
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
