import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { KafkaModule } from './kafka/module.kafka';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
    CommentModule,
    LikeModule,
    KafkaModule,
    PostModule,

  ],
})
export class AppModule { }
