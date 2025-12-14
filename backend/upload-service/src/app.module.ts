import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './upload/upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './upload/redis/module.redis';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    UploadModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // PrometheusModule.register({
    //   defaultMetrics: {
    //     enabled: true,
    //   },
    // }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
