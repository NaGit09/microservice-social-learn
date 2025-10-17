import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDto } from '../common/dto/follow/create-follow.dto';
import { DeleteDto } from '../common/dto/follow/delete-follow.dto';
import { FollowNotifyDto } from '../common/types/follow.resp';
import { FollowStatus } from '../common/constant/follow-status';
import { KafkaService } from 'src/kafka/config.kafka';
import { Follow, FollowDocument } from 'src/common/entities/follow.entity';

@Injectable()
export class FollowService {
  // DI
  private readonly logger = new Logger(FollowService.name)
  constructor(
    private readonly kafkaClient: KafkaService,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
  ) { }
  // Create new follow
  async create(dto: CreateDto): Promise<boolean> {
    const { requestId, targetId, status } = dto;
    if (requestId === targetId) {
      this.logger.error('user not follow yourself');

      throw new HttpException('user not follow yourself', HttpStatus.CONFLICT);
    }
    const exist = await this.followModel.findOne({
      requestId: requestId,
      targetId: targetId,
    });
    if (exist) {

      this.logger.error('Already followed this use or sent request follow');

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
    //
    const followNotify: FollowNotifyDto = {
      id: follow.id,
      requestId: follow.requestId,
      targetId: follow.targetId,
    };
    const topicType = follow.status === 'pending' ? 'request' : 'user';
    this.kafkaClient.emitMessage('follow-'.concat(topicType), followNotify);
    return true;
  }
  // user unfollow
  async delete(dto: DeleteDto) {
    const { requestId, targetId } = dto;
    const deleted = await this.followModel.findOneAndDelete({
      requestId: requestId,
      targetId: targetId,
    });
    if (!deleted) {

      this.logger.error('Follow relationship not found.');

      throw new HttpException(
        'Follow relationship not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Unfollow successfully' };
  }
  // user accept follow request
  async accept(followId: string): Promise<boolean> {
    const updated = await this.followModel.findOneAndUpdate(
      { _id: followId, status: 'pending' },
      { $set: { status: 'accepted' } },
      { new: true },
    );

    if (!updated) {

      this.logger.error('Follow request not found or already processed.');

      throw new HttpException(
        'Follow request not found or already processed.',
        HttpStatus.NOT_FOUND,
      );
    }
    // sent notify to kafka
    const followNotify: FollowNotifyDto = {
      id: updated.id,
      requestId: updated.targetId,
      targetId: updated.requestId,
    };
    this.kafkaClient.emitMessage('follow-accept', followNotify);
    return true;
  }
  // user reject follow request 
  async reject(followId: string) {
    const deleted = await this.followModel.findOneAndDelete({
      _id: followId,
      status: FollowStatus.REJECTED,
    });

    if (!deleted) {

      this.logger.error('Follow request not found or already processed.')

      throw new HttpException(
        'Follow request not found or already processed.',
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: 'Follow request rejected successfully' };
  }
  // get total user follower
  async totalFollower(targetId: string): Promise<number> {
    return this.followModel.countDocuments({
      targetId: targetId,
      status: FollowStatus.ACCEPTED,
    });
  }
  // get total user following 
  async totalFollowing(requestId: string): Promise<number> {
    return this.followModel.countDocuments({
      requestId: requestId,
    });
  }
}
