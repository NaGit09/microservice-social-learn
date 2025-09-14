import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Follow, FollowDocument } from './entities/follow.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDto } from './dto/create-follow.dto';
import { DeleteDto } from './dto/delete-follow.dto';

@Injectable()
export class FollowService implements OnModuleInit {
  // DI
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
  ) {}
  //
  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  greeting() {
    return 'hi im';
  }
  // Create new follow
  async create(dto: CreateDto): Promise<Follow> {
    const { requestId, targetId, status } = dto;
    const exist = await this.followModel.findOne({
      requestId: requestId,
      targetId: targetId,
    });
    if (exist) {
      throw new BadRequestException('Already followed this user.');
    }
    const follow = new this.followModel({
      requestId,
      targetId,
      status,
    });
    return follow.save();
  }
  //
  async delete(dto: DeleteDto) {
    const { requestId, targetId } = dto;
    const deleted = await this.followModel.findOneAndDelete({
      requestId: requestId,
      targetId: targetId,
    });
    if (!deleted) {
      throw new NotFoundException('Follow relationship not found.');
    }
    return { message: 'Unfollow successfully' };
  }
  //
  async accept(followId: string) {
    const updated = await this.followModel.findOneAndUpdate(
      { _id: followId, status: 'pending' }, // chỉ accept nếu đang pending
      { $set: { status: 'accepted' } },
      { new: true }, // trả về document sau khi update
    );

    if (!updated) {
      throw new Error('Follow request not found or already processed.');
    }

    return updated;
  }
  //
  async reject(followId: string) {
    const deleted = await this.followModel.findOneAndDelete({
      _id: followId,
      status: 'pending', // chỉ reject khi còn đang pending
    });

    if (!deleted) {
      throw new Error('Follow request not found or already processed.');
    }

    return { message: 'Follow request rejected successfully' };
  }

  async totalFollower(targetId: string): Promise<number> {
    return this.followModel.countDocuments({
      targetId: targetId,
      status: 'accepted', // nếu có trạng thái (chỉ đếm những follow đã accept)
    });
  }
  async totalFollowing(requestId: string): Promise<number> {
    return this.followModel.countDocuments({
      requestId: requestId,
    });
  }
}
