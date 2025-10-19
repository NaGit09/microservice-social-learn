import { forwardRef, Module } from '@nestjs/common';
import { Like, LikeSchema } from '../common/entities/like.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { KafkaModule } from 'src/kafka/module.kafka';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    KafkaModule,
    forwardRef(() => CommentModule),

    forwardRef(() => PostModule),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService]
})
export class LikeModule { }
