import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Follow, FollowDocument } from './entities/follow.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDto } from './dto/request/create-follow.dto';
import { DeleteDto } from './dto/request/delete-follow.dto';
import { KafkaService } from './kakfa/follow.kafka';
import { FollowNotifyDto } from './dto/response/follow.resp';

@Injectable()
export class FollowService {
  // DI
  constructor(
    private readonly kafkaClient: KafkaService,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
  ) {}
  //
  // Create new follow
  async create(dto: CreateDto): Promise<boolean> {
    const { requestId, targetId, status } = dto;
    if (requestId === targetId) {
      throw new HttpException('user not follow yourself', HttpStatus.CONFLICT);
    }
    const exist = await this.followModel.findOne({
      requestId: requestId,
      targetId: targetId,
    });
    if (exist) {
      throw new HttpException(
        'Already followed this use or sent request follow',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = new this.followModel({
      requestId,
      targetId,
      status,
    });
    await follow.save();
    const followNotify: FollowNotifyDto = {
      id: follow.id as string,
      actorId: follow.requestId,
      receiverId: follow.targetId,
    };
    const topicType = follow.status === 'pending' ? 'request' : 'user';
    this.kafkaClient.emitMessage('follow-'.concat(topicType), followNotify);
    return true;
  }
  //
  async delete(dto: DeleteDto) {
    const { requestId, targetId } = dto;
    const deleted = await this.followModel.findOneAndDelete({
      requestId: requestId,
      targetId: targetId,
    });
    if (!deleted) {
      throw new HttpException(
        'Follow relationship not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Unfollow successfully' };
  }
  //
  async accept(followId: string): Promise<boolean> {
    const updated = await this.followModel.findOneAndUpdate(
      { _id: followId, status: 'pending' }, // chỉ accept nếu đang pending
      { $set: { status: 'accepted' } },
      { new: true }, // trả về document sau khi update
    );

    if (!updated) {
      throw new HttpException(
        'Follow request not found or already processed.',
        HttpStatus.NOT_FOUND,
      );
    }
    const followNotify: FollowNotifyDto = {
      id: updated.id as string,
      actorId: updated.targetId,
      receiverId: updated.requestId,
    };
    this.kafkaClient.emitMessage('follow-accept', followNotify);
    return true;
  }
  //
  async reject(followId: string) {
    const deleted = await this.followModel.findOneAndDelete({
      _id: followId,
      status: 'pending', // chỉ reject khi còn đang pending
    });

    if (!deleted) {
      throw new HttpException(
        'Follow request not found or already processed.',
        HttpStatus.NOT_FOUND,
      );
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
