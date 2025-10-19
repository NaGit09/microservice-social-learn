import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from '../common/entities/comment.entity';
import { KafkaModule } from 'src/kafka/module.kafka';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    forwardRef(() => PostModule),

    KafkaModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule { }
