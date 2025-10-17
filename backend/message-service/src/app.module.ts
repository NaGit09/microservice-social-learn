import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './messages/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { SocketGateway } from './sockets/message.gateway';
import { JwtModule } from '@nestjs/jwt';
import { OnlineUsersService } from './services/online-users.service';
@Module({
  imports: [
    JwtModule.register({
      secret: 'jflskjwo302fwio@',
      signOptions: { expiresIn: '60m' },
    }),
    ConversationModule,
    MessageModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
  ],
  controllers: [],
  providers: [SocketGateway, OnlineUsersService], // ✅ bỏ 2 service ra khỏi đây
})
export class AppModule {}

