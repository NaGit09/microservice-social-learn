import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/module.kafka';
import { Post, PostSchema } from 'src/common/entities/post.entity';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    KafkaModule,
    forwardRef(() => LikeModule),
    forwardRef(() => CommentModule),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule { }
