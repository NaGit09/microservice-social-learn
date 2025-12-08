import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './notification/notification.module';
import { RedisModule } from './notification/redis/module.redis';
import { OnlineUsersService } from './notification/onlineUser.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
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
    NotificationModule,
    RedisModule
  ],
  controllers: [],
  providers: [OnlineUsersService],
})
export class AppModule {}
