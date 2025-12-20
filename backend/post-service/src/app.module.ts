import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { KafkaModule } from './kafka/module.kafka';
import { RedisModule } from './redis/module.redis';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
    LikeModule,
    KafkaModule,
    CommentModule,
    PostModule,
    RedisModule,
    AdminModule,
  ],
})
export class AppModule { }
