import { Module } from '@nestjs/common';
import { Like, LikeSchema } from './entities/like.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { KafkaModule } from 'src/kafka/module.kafka';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    KafkaModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule { }
