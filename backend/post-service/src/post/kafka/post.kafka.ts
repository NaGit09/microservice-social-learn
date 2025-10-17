import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from '../post.service';
import { AuthorInforResp } from '../dto/response/author.resp';
import { KafkaService } from 'src/kafka/config.kafka';
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
