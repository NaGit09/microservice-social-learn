import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import type { CreateLikeDto } from 'src/common/dto/like/like';
import type { DeleteDtoSchema } from 'src/common/dto/like/unlike';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post()
  async like(@Body() dto: CreateLikeDto) {
    const liked = await this.likeService.like(dto);
    return {
      success: true,
      data: liked,
    };
  }

  @Delete()
  async unlike(@Body() dto: DeleteDtoSchema) {
    const result = await this.likeService.unlike(dto);
    return {
      success: result,
      message: result ? 'Unliked successfully' : 'Nothing to unlike',
    };
  }

  @Get('total')
  async total(
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: string,
  ) {
    const count = await this.likeService.total(targetId, targetType);
    return {
      success: true,
      targetId,
      targetType,
      total: count,
    };
  }
}
