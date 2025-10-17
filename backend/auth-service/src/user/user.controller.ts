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
import {
  UpdateBioDtoSchema,
  type UpdateBioDto,
} from './dto/request/update-bio.req';
import {
  UpdateProfileDtoSchema,
  type UpdateProfileDto,
} from './dto/request/update-profile.req';
import {
  UpdateAvatarDtoSchema,
  type UpdateAvatartDto,
} from './dto/request/update-avatart.req';
import { ZodValidationPipe } from './pipe/zod-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Lấy thông tin user
  @Get(':id')
  async getInfor(@Param('id') id: string) {
    return this.userService.getInfor(id);
  }

  // Update profile
  @Put()
  @UsePipes(new ZodValidationPipe(UpdateProfileDtoSchema))
  async updateProfile(@Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(dto);
  }

  // Update bio
  @Patch('bio/update')
  @UsePipes(new ZodValidationPipe(UpdateBioDtoSchema))
  async updateBio(@Body() dto: UpdateBioDto) {
    return this.userService.updateBio(dto);
  }

  // Update avatar
  @Patch('avatar/update')
  @UsePipes(new ZodValidationPipe(UpdateAvatarDtoSchema))
  async updateAvatar(@Body() dto: UpdateAvatartDto) {
    return this.userService.updateAvatar(dto);
  }
}
