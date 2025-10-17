import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import type { CreateDto } from '../common/dto/follow/create-follow.dto';
import type { DeleteDto } from '../common/dto/follow/delete-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}
  @Post('follow')
  async create(@Body() dto: CreateDto) {
    return this.followService.create(dto);
  }
  @Delete('unfollow')
  async delete(@Body() dto: DeleteDto) {
    return this.followService.delete(dto);
  }
  @Patch(':id/accept')
  async accept(@Param('id') id: string) {
    return this.followService.accept(id);
  }
  @Patch(':id/reject')
  async reject(@Param('id') followId: string) {
    return this.followService.reject(followId);
  }
  @Get(':id/followers')
  async followers(@Param('id') id: string) {
    return this.followService.totalFollower(id);
  }
  @Get(':id/followings')
  async followings(@Param('id') id: string) {
    return this.followService.totalFollowing(id);
  }
}
