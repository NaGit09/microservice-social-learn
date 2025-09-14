import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createa-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateBioDto } from './dto/update-bio.dto';
import { UpdateAddressDto } from './dto/update-addres.dto';
import { UpdateInforDto } from './dto/update-infor.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  //
  async getInfor(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  //
  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      username: dto.username,
      _id: dto.userId,
    });
    return user.save();
  }
  async updateUser(userId: string, update: Record<string, any>): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return updatedUser;
  }
  async updateAvatar(dto: UpdateAvatarDto): Promise<User> {
    return this.updateUser(dto.userId, { avatar: dto.avatar });
  }

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    return this.updateUser(dto.userId, { profile: dto.profile });
  }

  async updateBio(dto: UpdateBioDto): Promise<User> {
    return this.updateUser(dto.userId, { bio: dto.bio });
  }

  async updateAddress(dto: UpdateAddressDto): Promise<User> {
    return this.updateUser(dto.userId, { address: dto.address });
  }

  async updateInfor(dto: UpdateInforDto): Promise<User> {
    return this.updateUser(dto.userId, dto);
  }

  //
}
