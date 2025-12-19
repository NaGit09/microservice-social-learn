import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';
import { UserModule } from './user/user.module';
import { KafkaModule } from './kafka/module.kafka';
import { RedisModule } from './redis/module.redis';
import { AdminModule } from './admin/admin.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    FollowModule,
    UserModule,
    KafkaModule,
    RedisModule,
    AdminModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
    MongooseModule.forRootAsync({

      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        maxPoolSize: 200,
        minPoolSize: 20,
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 30000,
        autoIndex: false,
        retryWrites: true,
      }),

    },),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [],
})
export class AppModule { }
