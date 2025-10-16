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
    // register module
    MessageModule,
    ConversationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // connect to mongodb
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
    }),
  ],
  controllers: [],
  providers: [SocketGateway, OnlineUsersService],
})
export class AppModule { }
