import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDtoSchema, type CreateFollowDto } from '../common/dto/follow/follow';
import { DeleteFollowDtoSchema, type DeleteFollowDto } from '../common/dto/follow/unfollow';
import { ZodValidationPipe } from 'src/common/pipe/ZodValidationPipe';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateFollowDtoSchema))
  async create(@Body() dto: CreateFollowDto) {
    return this.followService.create(dto);
  }
  @Delete()
  @UsePipes(new ZodValidationPipe(DeleteFollowDtoSchema))
  async delete(@Body() dto: DeleteFollowDto) {
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
