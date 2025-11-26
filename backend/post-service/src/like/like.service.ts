import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from '../common/entities/like.entity';
import { Model } from 'mongoose';
import { KafkaService } from 'src/kafka/config.kafka';
import { DeleteDtoSchema } from 'src/common/dto/like/unlike';
import { PostService } from 'src/post/post.service';
import { CreateLikeDto } from 'src/common/dto/like/like';
import { LikeNotify } from 'src/common/types/like-resp';
import { ApiResponse } from 'src/common/types/api-resp';
import { CommentService } from 'src/comment/comment.service';
import { TargetType } from 'src/common/enums/targetType.enum';
import { AuthorInforResp } from 'src/common/types/post-resp';

@Injectable()
export class LikeService {
  // DI
  private readonly logger = new Logger(LikeService.name);
  constructor(
    @Inject(forwardRef(() => PostService))
    private readonly post: PostService,

    @Inject(forwardRef(() => CommentService))
    private readonly comment: CommentService,

    private readonly kafkaClient: KafkaService,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) { }
  
  async like(dto: CreateLikeDto): Promise<ApiResponse<boolean>> {
    const { userId, targetType, targetId } = dto;
    try {
      const existingLike = await this.likeModel
        .findOne({
          userId,
          targetId,
          targetType,
        })
        .select('_id')
        .lean()
        .exec();

      if (existingLike) {
        await this.likeModel.deleteOne({ _id: existingLike._id });

        return {
          statusCode: 200,
          message: `Unliked ${targetType} successfully!`,
          data: false,
        };
      }

      await this.likeModel.create(dto);

      // Fire-and-forget notification
      this.handleLikeNotification(dto).catch((err) =>
        this.logger.warn(`Notification failed for ${targetId}: ${err.message}`),
      );

      return {
        statusCode: 201,
        message: `Liked ${targetType} successfully!`,
        data: true,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `Process ${targetType} like interaction failed`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async handleLikeNotification(dto: CreateLikeDto): Promise<void> {
    const { userId, targetType, targetId } = dto;
    let authorResp: AuthorInforResp;

    if (targetType === 'post') {
      authorResp = await this.post.getAuthorInfo(targetId);
    } else if (targetType === 'comment') {
      authorResp = await this.comment.getAuthorInfo(targetId);
    } else {
      return;
    }

    if (!authorResp) return;

    const likeEventPayload: LikeNotify = {
      actorId: userId,
      entityId: targetId,
      entitytitle: (authorResp.caption as string) ?? '',
      receiverId: (authorResp.authorId as string) ?? '',
    };

    const notificationTopic = `like-${targetType}`;
    this.kafkaClient.emit(notificationTopic, likeEventPayload);
  }

  async unlike(dto: DeleteDtoSchema): Promise<ApiResponse<boolean>> {
    const { userId, targetType, targetId } = dto;

    try {
      const deleteResult = await this.likeModel.deleteOne({
        userId: userId,
        targetId: targetId,
        targetType: targetType,
      });

      if (deleteResult.deletedCount === 0) {
        throw new HttpException(
          `Like not found. Unable to unlike ${targetType} with id: ${targetId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: 200,
        message: `Unlike ${targetType} with id: ${targetId} successfully!`,
        data: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Unlike ${targetType} failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async total(
    targetId: string,
    targetType: string,
  ): Promise<ApiResponse<number>> {
    try {
      const count = await this.likeModel.countDocuments({
        targetId: targetId,
        targetType: targetType,
      });

      return {
        statusCode: 200,
        message: `Get total likes for ${targetType} successfully!`,
        data: count,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to count likes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deleteLikesByTarget(
    targetIds: string | string[],
    targetType: TargetType,
  ): Promise<void> {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];

    if (ids.length === 0) {
      this.logger.log(
        `[deleteLikesByTarget] No target IDs provided for ${targetType}.`,
      );
      return;
    }

    this.logger.log(
      `[deleteLikesByTarget] Deleting likes for ${ids.length} ${targetType} target(s).`,
    );

    try {
      const query = {
        targetId: { $in: ids },
        targetType: targetType,
      };

      const result = await this.likeModel.deleteMany(query).exec();

      this.logger.log(
        `[deleteLikesByTarget] Successfully deleted ${result.deletedCount} likes.`,
      );
    } catch (error) {
      this.logger.error(
        `[deleteLikesByTarget] Failed to delete likes: ${error.message}`,
      );
      throw error;
    }
  }
}
