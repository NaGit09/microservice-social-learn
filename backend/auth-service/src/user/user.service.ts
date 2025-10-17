import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/request/createa-user.req';
import { Profile, ProfileDocument } from './schema/profile.schema';
import { mapperUserToDto } from './utils/user.mapper';
import { userInfo } from './dto/response/user.resp';
import { UpdateBioDto } from './dto/request/update-bio.req';
import { UpdateAvatartDto } from './dto/request/update-avatart.req';
import { UpdateProfileDto } from './dto/request/update-profile.req';
import { ProfileDto } from './dto/response/profile.resp';
import { mapperProfileToDto } from './utils/profile.mapper';
import { KafkaService } from 'src/kafka/config.kafka';

@Injectable()
export class UserService {
  constructor(
    private kafkaClient: KafkaService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}
  // return user info
  async getInfor(id: string): Promise<userInfo> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return mapperUserToDto(user);
  }
  // create new user with data from kafka
  async create(dto: CreateUserDto): Promise<userInfo> {
    //phase 1: receive data
    const user = new this.userModel({
      _id: dto.userId,
      username: dto.username,
      fullname: dto.fullname,
    });
    //phase 2: handle and save into db
    const savedUser = await user.save();
    // phase 3: create new profile and save into db
    const newProfile = new this.profileModel({
      _id: dto.userId,
    });
    await newProfile.save();
    // finaly : mapper to dto and response
    return mapperUserToDto(savedUser);
  }
  // update user bio
  async updateBio(dto: UpdateBioDto): Promise<boolean> {
    const userUpdated = await this.userModel.findByIdAndUpdate(dto.userId, {
      bio: dto.bio,
    });
    if (!userUpdated) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
  //
  async updateAvatar(dto: UpdateAvatartDto): Promise<boolean> {
    const user = await this.userModel.findById(dto.userId).exec();

    if (!user) {
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
      throw new HttpException(
        `Profile with userId ${dto.userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const profileDto = mapperProfileToDto(updatedProfile);
    return profileDto;
  }
}
