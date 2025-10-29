import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateBioDtoSchema, type UpdateBioDto } from '../common/dto/user/bio';
import {
  UpdateProfileDtoSchema,
  type UpdateProfileDto,
} from '../common/dto/user/profile';
import {
  UpdateAvatarDtoSchema,
  type UpdateAvatartDto,
} from '../common/dto/user/avatar';
import { ZodValidationPipe } from 'src/common/pipe/ZodValidationPipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Get user info
  @Get(':id')
  async getInfor(@Param('id') id: string) {
    return this.userService.getInfor(id);
  }
  // Update profile
  @Put('profile')
  @UsePipes(new ZodValidationPipe(UpdateProfileDtoSchema))
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(dto);
  }

  // Update bio
  @Patch('bio')
  @UsePipes(new ZodValidationPipe(UpdateBioDtoSchema))
  async updateBio(@Body() dto: UpdateBioDto) {
    return this.userService.updateBio(dto);
  }

  // Update avatar
  @Patch('avatar')
  @UsePipes(new ZodValidationPipe(UpdateAvatarDtoSchema))
  async updateAvatar(@Body() dto: UpdateAvatartDto) {
    return this.userService.updateAvatar(dto);
  }
  @Get('profile/:id')
  async getProfile(@Param(':id') userId: string) {
    return this.getProfile(userId);
  }
}
