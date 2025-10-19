import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFollowDto } from '../common/dto/follow/follow';
import { FollowNotify } from '../common/types/follow';
import { FollowStatus } from '../common/constant/follow-status';
import { KafkaService } from 'src/kafka/config.kafka';
import { Follow, FollowDocument } from 'src/common/entities/follow';
import { DeleteFollowDto } from 'src/common/dto/follow/unfollow';
import { ApiResponse } from 'src/common/types/api.res';

@Injectable()
export class FollowService {
  // DI
  private readonly logger = new Logger(FollowService.name)
  constructor(
    private readonly kafkaClient: KafkaService,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
  ) { }
  // Create new follow
  async create(dto: CreateFollowDto): Promise<ApiResponse<boolean>> {
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
    const followNotify = new FollowNotify(follow);

    const topicType = follow.status === 'PENDING' ? 'request' : 'user';
    this.kafkaClient.emit('follow-'.concat(topicType), followNotify);

    return { statusCode: 200, message: "Follow user successfully", data: true };
  }
  // user unfollow
  async delete(dto: DeleteFollowDto): Promise<ApiResponse<boolean>> {
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
    return { statusCode: 200, message: 'Unfollow successfully', data: true };
  }
  // user accept follow request
  async accept(followId: string): Promise<ApiResponse<boolean>> {
    const updated = await this.followModel.findOneAndUpdate(
      { _id: followId, status: 'PENDING' },
      { $set: { status: 'ACCEPTED' } },
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
    const followNotify = new FollowNotify(updated);
    this.kafkaClient.emit('follow-accept', followNotify);
    return { statusCode: 200, message: "Follow accept successfully", data: true };

  }
  // user reject follow request 
  async reject(followId: string): Promise<ApiResponse<boolean>> {
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

    return { statusCode: 200, message: 'Follow request rejected successfully', data: true };
  }
  // get total user follower
  async totalFollower(targetId: string): Promise<ApiResponse<number>> {
    const total = await this.followModel.countDocuments({
      targetId: targetId,
      status: FollowStatus.ACCEPTED,
    }).exec();
    return { statusCode: 200, message: 'get total follower successfully', data: total };

  }
  // get total user following 
  async totalFollowing(requestId: string): Promise<ApiResponse<number>> {
    const total = await this.followModel.countDocuments({
      requestId: requestId,
    }).exec();

    return { statusCode: 200, message: ' get total following   successfully', data: total };

  }
  //
}
