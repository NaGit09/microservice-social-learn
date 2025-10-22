import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './messages/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { SocketGateway } from './sockets/message.gateway';
import { OnlineUsersService } from './kafka/online-users.service';
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
    ConversationModule,
    MessageModule,
    KafkaModule,
  ],
  providers: [SocketGateway, OnlineUsersService],
})

export class AppModule { }

