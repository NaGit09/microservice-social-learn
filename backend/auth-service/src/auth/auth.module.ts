import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from 'src/common/utils/JwtRefresh.strategy';
import { JwtStrategy } from 'src/common/utils/jwt.strategy';
import { Account, AccountSchema } from 'src/common/entities/account';
import { KafkaModule } from 'src/kafka/module.kafka';
import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/module.redis';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    KafkaModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthModule { }
