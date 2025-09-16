import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './entities/like.entity';
import { Model } from 'mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { CreateDtoSchema } from './dto/create-like.dto';
import { DeleteDtoSchema } from './dto/delete-like.dto';

@Injectable()
export class LikeService implements OnModuleInit {
  // DI
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}
  //
  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  //
  async like(dto: CreateDtoSchema) {
    const { userId, targetType, targetId } = dto;
    const liked = new this.likeModel({
      userId,
      targetId,
      targetType,
    });
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
