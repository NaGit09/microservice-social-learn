import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import type { CreatePostDto } from 'src/common/dto/post/create';
import type { UpdatePostDto } from 'src/common/dto/post/update';
import type { SharePostDto } from 'src/common/dto/post/share';

@Controller('post')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post()
  async create(@Body() dto: CreatePostDto) {
    return this.service.create(dto);
  }

  @Patch()
  async edit(@Body() dto: UpdatePostDto) {
    return this.service.edit(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('user/:id')
  async getAllPost(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.getPostByAuthor(id, Number(page), Number(limit));
  }

  @Post('share')
  async sharePost(@Body() dto: SharePostDto) {
    return this.service.sharePost(dto);
  }

  @Get(':id/total')
  async totalPost(@Param('id') id: string) {
    return this.service.totalPost(id);
  }
  @Get('random/:size')
  async randomPost(@Param('size') size = 10) {
    return this.service.getRandomPosts(size);
  }
}
