import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Patch,
  UsePipes,
  Query,
  ParseArrayPipe,
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
import {
  ReportUserDtoSchema,
  type ReportUserDto,
} from '../common/dto/user/report.dto';
import { ZodValidationPipe } from 'src/common/pipe/ZodValidationPipe';
import { participantsQuerySchema } from 'src/common/dto/user/user-info';
import { JwtPayload } from 'src/common/types/JwtPayload';
import { CurrentUser } from '../common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Get paticipant info
  @Get('participants')
  async getPaticipantsInfo(
    @Query('ids', new ZodValidationPipe(participantsQuerySchema)) ids: string[],
  ) {
    return this.userService.getPaticipantsInfo(ids);
  }
  @Get('search')
  async searchUsers(@Query('q') query: string) {
    return this.userService.searchUsers(query);
  }

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
  @Patch('avatar/update')
  @UsePipes(new ZodValidationPipe(UpdateAvatarDtoSchema))
  async updateAvatar(@Body() dto: UpdateAvatartDto) {
    return this.userService.updateAvatar(dto);
  }
  @Patch('avatar/remove/:id')
  async removeAvatar(@Param('id') userId: string) {
    return this.userService.removeAvatar(userId);
  }

  @Get('profile/:id')
  async getProfileInfo(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Post('report')
  @UsePipes(new ZodValidationPipe(ReportUserDtoSchema))
  async reportUser(@Body() dto: ReportUserDto, @CurrentUser() user: JwtPayload) {
    return this.userService.reportUser(user.sub.toString(), dto);
  }

}
