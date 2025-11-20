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
import { RedisService } from 'src/redis/config.redis';
import { REDIS_TTL } from 'src/common/constant/constants';

@Injectable()
export class FollowService {
  // DI
  private readonly logger = new Logger(FollowService.name);

  constructor(
    private readonly kafka: KafkaService,
    private readonly redis: RedisService,
    @InjectModel(Follow.name)
    private followModel: Model<FollowDocument>,
  ) {}

  // Get follow request
  async getFollow(
    targetId: string,
    requestId: string,
  ): Promise<ApiResponse<Follow>> {
    const follow = await this.followModel.findOne({
      targetId: targetId,
      requestId: requestId,
    });

    if (!follow) {
      throw new HttpException('Follow request not found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: 200,
      message: 'Get follow request successfully',
      data: follow,
    };
  }

  // Create new follow
  async create(dto: CreateFollowDto):
    Promise<ApiResponse<boolean>> {
    const { requestId, targetId } = dto;

    if (requestId === targetId) {
      throw new HttpException(
        'User cannot follow themself',
        HttpStatus.CONFLICT,
      );
    }

    const exist = await this.followModel.findOne({ requestId, targetId });
    if (exist) {
      throw new HttpException(
        'Already followed or already sent follow request',
        HttpStatus.BAD_REQUEST,
      );
    }

    const opposite = await this.followModel.findOne({
      requestId: targetId,
      targetId: requestId,
    });

    let status = FollowStatus.PENDING;

    if (opposite) {
      opposite.status = FollowStatus.ACCEPTED;
      await opposite.save();
      status = FollowStatus.ACCEPTED;
    }

    const follow = new this.followModel({ requestId, targetId, status });
    await follow.save();

    const followNotify = new FollowNotify(follow);
    const topic =
      status === FollowStatus.PENDING ? 'follow-request' : 'follow-user';

    this.kafka.emit(topic, followNotify);

    return {
      statusCode: 200,
      message: 'Follow user successfully',
      data: true,
    };
  }

  // user unfollow
  async delete(dto: DeleteFollowDto):
    Promise<ApiResponse<boolean>> {
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
  async accept(followId: string):
    Promise<ApiResponse<boolean>> {
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
    this.kafka.emit('follow-accept', followNotify);
    return {
      statusCode: 200,
      message: 'Follow accept successfully',
      data: true,
    };
  }

  // user reject follow request
  async reject(followId: string):
    Promise<ApiResponse<boolean>> {
    const deleted = await this.followModel.findOneAndDelete({
      _id: followId,
      status: FollowStatus.REJECTED,
    });

    if (!deleted) {
      this.logger.error('Follow request not found or already processed.');

      throw new HttpException(
        'Follow request not found or already processed.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: 200,
      message: 'Follow request rejected successfully',
      data: true,
    };
  }

  // get total user follower
  async totalFollower(targetId: string):
    Promise<ApiResponse<number>> {
    if (!targetId) {
      throw new HttpException('Invalid targetId', HttpStatus.BAD_REQUEST);
    }
    const totalCache = await this.redis.getData<number>(
      `follow:totalFollower:${targetId}`,
    );
    if (totalCache !== null && totalCache !== undefined) {
      return {
        statusCode: 200,
        message: 'get total following successfully',
        data: totalCache,
      };
    }
    const total = await this.followModel
      .countDocuments({
        targetId: targetId,
        status: FollowStatus.ACCEPTED,
      })
      .exec();
    this.redis.setData(`follow:totalFollower:${targetId}`, total, REDIS_TTL);

    return {
      statusCode: 200,
      message: 'get total follower successfully',
      data: total,
    };
  }

  // get total user following
  async totalFollowing(requestId: string):
    Promise<ApiResponse<number>> {
    if (!requestId) {
      throw new HttpException('Invalid targetId', HttpStatus.BAD_REQUEST);
    }
    const totalCache = await this.redis.getData<number>(
      `follow:totalFollowing:${requestId}`,
    );
    if (totalCache !== null && totalCache !== undefined) {
      return {
        statusCode: 200,
        message: 'get total following successfully',
        data: totalCache,
      };
    }
    const total = await this.followModel
      .countDocuments({
        requestId: requestId,
      })
      .exec();
    this.redis.setData(`follow:totalFollowing:${requestId}`, total, REDIS_TTL);
    return {
      statusCode: 200,
      message: ' get total following   successfully',
      data: total,
    };
  }
  //
}
