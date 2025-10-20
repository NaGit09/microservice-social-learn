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
  constructor(private readonly postService: PostService) { }

  @Post()
  async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Patch()
  async edit(@Body() dto: UpdatePostDto) {
    return this.postService.edit(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }

  @Get(':id/post')
  async getById(@Param('id') id: string) {
    return this.postService.getById(id);
  }

  @Get(':id')
  async getAllPost(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postService.getPostByAuthor(id, Number(page), Number(limit));
  }

  @Post('share')
  async sharePost(@Body() dto: SharePostDto) {
    return this.postService.sharePost(dto);
  }

  @Get(':id/total')
  async totalPost(@Param('id') id: string) {
    return this.postService.totalPost(id);
  }
  @Get('random/:size')
  async randomPost(@Param('size') size: number) {
    return this.postService.getRandomPosts(size);
  }
}
