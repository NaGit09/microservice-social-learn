import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from 'src/common/dto/comment/create';
import { UpdateCommentDto } from 'src/common/dto/comment/update';
import { ReplyCommentDto } from 'src/common/dto/comment/reply';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Put()
  async edit(@Body() dto: UpdateCommentDto) {
    return this.commentService.update(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commentService.delete(id);
  }

  @Post('reply')
  async reply(@Body() dto: ReplyCommentDto) {
    return this.commentService.reply(dto);
  }

  @Get('/post/:id')
  async getCommentPost(
    @Param('id') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commentService.getCommentRoot(postId, +page, +limit);
  }

  @Get('reply/:id')
  async getReplyCommment(
    @Param('id') commentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commentService.getReplyComment(commentId, +page, +limit);
  }
}
