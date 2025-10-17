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
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { ReplyCommentDto } from './dto/request/reply-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // tổng số comment của post
  @Get(':postId/total')
  async getTotal(@Param('postId') postId: string) {
    return this.commentService.total(postId);
  }

  // tạo comment mới
  @Post()
  async create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  // cập nhật comment
  @Put()
  async edit(@Body() dto: UpdateCommentDto) {
    return this.commentService.update(dto);
  }

  // xóa comment theo id
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commentService.delete(id);
  }

  // xóa tất cả comment trong 1 post
  @Delete('post/:postId')
  async deletePost(@Param('postId') postId: string) {
    return this.commentService.deletePost(postId);
  }

  // reply vào comment
  @Post('reply')
  async reply(@Body() dto: ReplyCommentDto) {
    return this.commentService.reply(dto);
  }

  // lấy root comment của post (pagination)
  @Get('post/:postId')
  async getCommentPost(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commentService.getCommentRoot(postId, +page, +limit);
  }

  // lấy reply comment của 1 comment (pagination)
  @Get('reply/:commentId')
  async getReplyCommment(
    @Param('commentId') commentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commentService.getReplyComment(commentId, +page, +limit);
  }
}
