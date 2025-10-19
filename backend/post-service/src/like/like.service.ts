import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
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

@Injectable()
export class LikeService {
  // DI
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
      const existingLike = await this.likeModel.findOneAndUpdate(
        { userId, targetId, targetType },
        { $setOnInsert: dto },
        { upsert: true, new: false },
      );

      if (existingLike === null) {
        let authorInfo;
        if (targetType === 'post') {
          authorInfo = await this.post.getAuthorInfo(targetId);
        }
        else {
          authorInfo = await this.comment.getAuthorInfo(targetId);
        }

        const likeNotify = new LikeNotify(userId, authorInfo, targetId);
        const notificationTopic = `like-${targetType}`;
        this.kafkaClient.emit(notificationTopic, likeNotify);
      }

      return {
        statusCode: 200,
        message: `Like ${targetType} successfully!`,
        data: true,
      };
    } catch (error) {
      throw new HttpException(
        `Like ${targetType} failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
}
