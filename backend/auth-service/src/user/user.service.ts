import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    private kafkaClient: KafkaService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) { }
  // return user info
  async getInfor(id: string): Promise<ApiResponse<UserInfo>> {
    const user = await this.userModel.findOne({ _id: id })
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const resp = new UserInfo(user);

    return { statusCode: 200, message: "get user info successfully !", data: resp };
  }
  // create user after account created 
  async create(dto: CreateUserDto) {
    let savedUser: UserDocument;

    try {

      const newUser = new this.userModel({
        _id: dto.id,
        username: dto.username,
        fullname: dto.fullname,
      });

      const newProfile = new this.profileModel({
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
  async updateBio(dto: UpdateBioDto): Promise<ApiResponse<boolean>> {
    const { userId, bio } = dto;
    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        bio: bio,
      }, { isNew: true });
    if (!userUpdated) {
      this.logger.warn("User not found");
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return { statusCode: 200, message: "Update bio successfully", data: true };
  }
  // user update avatar
  async updateAvatar(dto: UpdateAvatartDto): Promise<ApiResponse<boolean>> {
    const user = await this.userModel.findById(dto.userId).exec();

    if (!user) {
      this.logger.warn("User not found");
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const oldAvatar = user.avatar;

    user.avatar = dto.avatar;
    await user.save();

    if (oldAvatar) {
      this.kafkaClient.emit('delete-avatar', {
        ids: [oldAvatar.fileId],
      });
    }

    return { statusCode: 200, message: "Update avatar successfully", data: true };
  }
  // user update profile 
  async updateProfile(dto: UpdateProfileDto): Promise<ApiResponse<ProfileResp>> {
    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { _id: dto.userId },
      { $set: dto },
      { new: true },
    );

    if (!updatedProfile) {
      this.logger.warn(`Profile with userId ${dto.userId} not found`,)
      throw new HttpException(
        `Profile with userId ${dto.userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const profileDto = new ProfileResp(updatedProfile);
    return { statusCode: 200, message: "Update profile successfully !", data: profileDto };
  }
}
