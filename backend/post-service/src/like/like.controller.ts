import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import type { CreateLikeDto } from 'src/common/dto/like/like';
import type { DeleteDtoSchema } from 'src/common/dto/like/unlike';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post()
  async like(@Body() dto: CreateLikeDto) {
    return await this.likeService.like(dto);
  }

  @Delete()
  async unlike(@Body() dto: DeleteDtoSchema) {
    return await this.likeService.unlike(dto);
  }

  @Get('total')
  async total(
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: string,
  ) {
    return this.likeService.total(targetId, targetType);
  }
}
