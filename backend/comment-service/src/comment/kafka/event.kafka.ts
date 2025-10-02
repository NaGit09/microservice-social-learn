import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthorInforResp } from '../dto/response/author.resp';
import { KafkaService } from './comment.kafka';
import { CommentService } from '../comment.service';
@Controller()
export class EventKafka {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly commentService: CommentService,
  ) {}
  @MessagePattern('get-author-comment')
  async getAuthor(commentId: string): Promise<AuthorInforResp> {
    return this.commentService.getAuthorInfo(commentId);
  }
}
