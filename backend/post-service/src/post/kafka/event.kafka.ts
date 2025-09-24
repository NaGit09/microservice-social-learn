import { Controller } from '@nestjs/common';
import { KafkaService } from './post.kafka';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from '../post.service';
import { AuthorInforResp } from '../dto/author.resp';
@Controller()
export class EventKafka {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly postService: PostService,
  ) {}
  @MessagePattern('get-author-post')
  async getAuthor(postId: string): Promise<AuthorInforResp> {
    return this.postService.getAuthorInfo(postId);
  }
}
