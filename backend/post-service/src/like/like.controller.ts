import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import type { CreateDtoSchema } from './dto/create-like.dto';
import type { DeleteDtoSchema } from './dto/delete-like.dto';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // @Post()
  // async like(@Body() dto: CreateDtoSchema) {
  //   const liked = await this.likeService.like(dto);
  //   return {
  //     success: true,
  //     data: liked,
  //   };
  // }

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
