import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createa-user.dto';

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
      _id: dto.userId,
      username: dto.username,
    });
    return user.save();
  }

  async updateUser(userId: string, update: Record<string, any>): Promise<User> {
    const forbiddenFields = ['_id', 'createdAt', 'updatedAt'];
    for (const field of forbiddenFields) {
      if (update[field] !== undefined) {
        throw new BadRequestException(`Field "${field}" cannot be updated`);
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return updatedUser;
  }
}
