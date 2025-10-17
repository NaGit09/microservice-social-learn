import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../common/dto/user/createa-user.req';
import { userInfo } from '../common/types/user.resp';
import { UpdateBioDto } from '../common/dto/user/update-bio.req';
import { UpdateAvatartDto } from '../common/dto/user/update-avatart.req';
import { UpdateProfileDto } from '../common/dto/user/update-profile.req';
import { ProfileDto } from '../common/types/profile.resp';
import { User, UserDocument } from 'src/common/entities/user.schema';
import { Profile, ProfileDocument } from 'src/common/entities/profile.schema';
import { KafkaService } from 'src/kafka/config.kafka';
import { mapperUserToDto } from 'src/common/utils/user.mapper';
import { mapperProfileToDto } from 'src/common/utils/profile.mapper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    private kafkaClient: KafkaService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) { }
  // return user info
  async getInfor(id: string): Promise<userInfo> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return mapperUserToDto(user);
  }
  //
  async create(dto: CreateUserDto): Promise<userInfo> {
    const user = new this.userModel({
      _id: dto.id,
      username: dto.username,
      fullname: dto.fullname,
    });
    const savedUser = await user.save();
    const newProfile = new this.profileModel({
      _id: dto.id,
    });
    await newProfile.save();
    return mapperUserToDto(savedUser);
  }
  //
  async updateBio(dto: UpdateBioDto): Promise<boolean> {
    const userUpdated = await this.userModel.findByIdAndUpdate(dto.userId, {
      bio: dto.bio,
    });
    if (!userUpdated) {
      this.logger.warn("User not found");
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
  //
  async updateAvatar(dto: UpdateAvatartDto): Promise<boolean> {
    const user = await this.userModel.findById(dto.userId).exec();

    if (!user) {
      this.logger.warn("User not found");
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const oldAvatar = user.avatar;

    user.avatar = dto.avatar;
    await user.save();

    if (oldAvatar) {
      this.kafkaClient.emitMessage('delete-avatar', {
        ids: [oldAvatar.fileId],
      });
    }

    return true;
  }
  //
  async updateProfile(dto: UpdateProfileDto): Promise<ProfileDto> {
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
    const profileDto = mapperProfileToDto(updatedProfile);
    return profileDto;
  }
}
