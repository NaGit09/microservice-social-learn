import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../common/dto/user/create';
import { UpdateBioDto } from '../common/dto/user/bio';
import { UpdateAvatartDto } from '../common/dto/user/avatar';
import { UpdateProfileDto } from '../common/dto/user/profile';
import { User, UserDocument } from 'src/common/entities/user';
import { Profile, ProfileDocument } from 'src/common/entities/profile';
import { KafkaService } from 'src/kafka/config.kafka';
import { ApiResponse } from 'src/common/types/api.res';
import { ProfileResp } from 'src/common/types/profile.resp';
import { UserInfo } from 'src/common/types/user';
import { DEFAULT_AVATAR, REDIS_TTL } from 'src/common/constant/constants';
import { RedisService } from 'src/redis/config.redis';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
    private kakfa: KafkaService,
    private redis : RedisService,
    @InjectModel(User.name) private user: Model<UserDocument>,
    @InjectModel(Profile.name) private profile: Model<ProfileDocument>,
  ) { }

  // return user info
  async getInfor(id: string)
    : Promise<ApiResponse<UserInfo>> {
    if (!id || !Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid User ID provided: ${id}`);
      throw new HttpException(
        'User ID is missing or invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
    const cacheInfo = await this.redis.getData < UserInfo>(`user:info:${id}`);
    if (cacheInfo) {
      return {
        statusCode: 200,
        message: 'get user info successfully !',
        data: cacheInfo,
      };
    }
    const user = await this.user.findById(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const resp = new UserInfo(user);
    this.redis.setData(`user:info:${id}`,resp , REDIS_TTL)
    return {
      statusCode: 200,
      message: 'get user info successfully !',
      data: resp,
    };
  }
  // create user after account created
  async create(dto: CreateUserDto) {
    let savedUser: UserDocument;

    try {
      const newUser = new this.user({
        _id: dto.id,
        username: dto.username,
        fullname: dto.fullname,
      });

      const newProfile = new this.profile({
        _id: dto.id,
      });

      const [userResult] = await Promise.all([
        newUser.save(),
        newProfile.save(),
      ]);

      savedUser = userResult;
    } catch (error) {
      throw new HttpException(
        `Không thể tạo user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return savedUser;
  }
  // user update bio
  async updateBio(dto: UpdateBioDto)
    : Promise<ApiResponse<boolean>> {
    const { userId, bio } = dto;
    const userUpdated = await this.user.findOneAndUpdate(
      { _id: userId },
      {
        bio: bio,
      },
      { isNew: true },
    );
    if (!userUpdated) {
      this.logger.warn('User not found');
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return { statusCode: 200, message: 'Update bio successfully', data: true };
  }

  // user update avatar
  async updateAvatar(dto: UpdateAvatartDto)
    : Promise<ApiResponse<boolean>> {
    const { userId, avatar } = dto;

    const user = await this.user.findById(userId).exec();
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const oldAvatar = user.avatar;
    const oldAvatarFileId = oldAvatar?.fileId;

    user.avatar = avatar;
    try {
      await user.save();
    } catch (dbError) {
      this.logger.error(`Failed to save new avatar to DB: ${dbError.message}`);
      throw new HttpException(
        'Database error updating avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      await this.kakfa.emit('file-published', [avatar.fileId]);
    } catch (kafkaError) {
      this.logger.error(
        `CRITICAL: DB saved, but 'file-published' event failed for file ${avatar.fileId}.
         Rolling back DB. Error: ${kafkaError.message}`,
      );

      user.avatar = oldAvatar;
      try {
        await user.save();
        this.logger.log(`Successfully rolled back avatar for user ${userId}`);
      } catch (rollbackError) {
        this.logger.error(
          `CRITICAL_FAILURE: Failed to rollback avatar for user ${userId}.
           DB is inconsistent. Manual intervention required.`,
        );
      }

      throw new HttpException(
        'Failed to publish avatar file, change was rolled back.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (oldAvatarFileId) {
      try {
        await this.kakfa.emit('file-delete', [oldAvatarFileId]);
      } catch (kafkaError) {
        this.logger.warn(
          `Avatar updated, but failed to emit 'avatar-delete' for old file ${oldAvatarFileId}. 
          This file is now an orphan. Error: ${kafkaError.message}`,
        );
      }
    }

    return {
      statusCode: 200,
      message: 'Update avatar successfully',
      data: true,
    };
  }

  // user update profile
  async updateProfile(
    dto: UpdateProfileDto,
  ): Promise<ApiResponse<ProfileResp>> {
    
    const updatedProfile = await this.profile.findOneAndUpdate(
      { _id: dto.id },
      { $set: dto },
      { new: true },
    );

    if (!updatedProfile) {
      this.logger.warn(`Profile with userId ${dto.id} not found`);
      throw new HttpException(
        `Profile with userId ${dto.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const profileDto = new ProfileResp(updatedProfile);
    return {
      statusCode: 200,
      message: 'Update profile successfully !',
      data: profileDto,
    };
  }

  async getProfile(userId: string)
    : Promise<ApiResponse<Profile>> {
    console.log(userId);

    if (!userId) {
      throw new HttpException(
        'User ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const cacheData = await this.redis.getData<Profile>(`user:profile:${userId}`);
    if (cacheData) {
           return {
        statusCode: 200,
        message: 'Get user profile successfully !',
             data: cacheData ,
      };
    }
    const profile = await this.profile.findOne({ _id: userId }).exec();

    if (!profile) {
      throw new HttpException(
        `User profile not found with id: ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.redis.setData(`user:profile:${profile.id}`,profile,REDIS_TTL)
    return {
      statusCode: 200,
      message: 'Get user profile successfully !',
      data: profile,
    };
  }

  async removeAvatar(userId: string)
    : Promise<Boolean> {
    const user = await this.user.findOne({ id: userId }).exec();

    if (user) {
      console.log(user.avatar.fileId);
      
      this.kakfa.emit('file-delete', [user.avatar.fileId]);
      user.avatar = DEFAULT_AVATAR as any;
      await user.save();
      return true;
    }
    return false;
  }
}
