import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './entities/comment.entity';
import { KafkaModule } from 'src/kafka/module.kafka';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    KafkaModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
