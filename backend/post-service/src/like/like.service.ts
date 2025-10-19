import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from '../common/entities/like.entity';
import { Model } from 'mongoose';
import { KafkaService } from 'src/kafka/config.kafka';
import { DeleteDtoSchema } from 'src/common/dto/like/unlike';
import { LikeNotify } from 'src/common/types/like-notification';
import { PostService } from 'src/post/post.service';
import { CreateLikeDto } from 'src/common/dto/like/like';

@Injectable()
export class LikeService {
  // DI
  constructor(
    @Inject(forwardRef(() => PostService))
    private readonly post: PostService,
    
    private readonly kafkaClient: KafkaService,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async like(dto: CreateLikeDto) {
    const { userId, targetType, targetId } = dto;
    const liked = new this.likeModel({ userId, targetId, targetType });
    
    const autherInfo = this.post.getAuthorInfo(targetId);

    const likeNotify: LikeNotify = {
      actorId: userId,
      entitytitle: (await autherInfo).caption,
      entityId: targetId,
      receiverId: (await autherInfo).authorId,
    };

    const notificationTopic = 'like-'.concat(targetType);
    this.kafkaClient.emitMessage(notificationTopic, likeNotify);
    
    return await liked.save();
  }
  async unlike(dto: DeleteDtoSchema) {
    const { userId, targetType, targetId } = dto;
    const deleted = await this.likeModel.deleteOne({
      userId: userId,
      targetId: targetId,
      targetType: targetType,
    });
    return deleted;
  }
  async total(targetId: string, targetType: string) {
    return this.likeModel.countDocuments({
      targetId: targetId,
      targetType: targetType,
    });
  }
}
