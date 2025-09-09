import { Body, Controller, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createa-user.dto';
import { UpdateInforDto } from './dto/update-infor.dto';
import { UpdateBioDto } from './dto/update-bio.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateAddressDto } from './dto/update-addres.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  @Put('infor')
  async updateInfor(@Body() dto: UpdateInforDto) {
    return this.userService.updateInfor(dto);
  }
  @Patch('bio')
  async updateBio(@Body() dto: UpdateBioDto) {
    return this.userService.updateBio(dto);
  }
  @Patch('avatar')
  async updateAvatar(@Body() dto: UpdateAvatarDto) {
    return this.userService.updateAvatar(dto);
  }
  @Patch('address')
  async updateAddress(@Body() dto: UpdateAddressDto) {
    return this.userService.updateAddress(dto);
  }
  @Patch('profile')
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(dto);
  }
}
