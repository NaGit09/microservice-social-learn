import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './entities/like.entity';
import { Model } from 'mongoose';
import { CreateDtoSchema } from './dto/create-like.dto';
import { DeleteDtoSchema } from './dto/delete-like.dto';
import { KafkaService } from './like.kafka';
import { firstValueFrom } from 'rxjs';
import { AuthorInforResp } from './dto/author.resp';
import { NotificationResp } from './dto/notification.resp';

@Injectable()
export class LikeService {
  // DI
  constructor(
    private readonly kafkaClient: KafkaService,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async like(dto: CreateDtoSchema) {
    const { userId, targetType, targetId } = dto;
    const liked = new this.likeModel({ userId, targetId, targetType });

    const getTopic = 'get-author-'.concat(targetType);

    // Convert Observable -> Promise
    const authorInfo = await firstValueFrom(
      this.kafkaClient.sendMessage<AuthorInforResp>(getTopic, targetId),
    );
    const likeNotify: NotificationResp = {
      actorId: userId,
      entitytitle: authorInfo.caption,
      entityId: targetId,
      receiverId: authorInfo.authorId,
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
