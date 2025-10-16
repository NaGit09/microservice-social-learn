import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Partitioners } from 'kafkajs';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'src/common/schema/message.entity';
import { MessageService } from './message.service';
import { KafkaService } from 'src/services/config.kafka';
import {
  Conversation,
  ConversationSchema,
} from 'src/common/schema/conversation.entity';

@Module({
  imports: [
    // register schema
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    // create connect to kafka
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId:
                config.get<string>('KAFKA_CLIENT_ID') ?? 'message-service',
              brokers: [config.get<string>('KAFKA_BROKER') ?? 'localhost:9092'],
            },
            consumer: {
              groupId:
                config.get<string>('KAFKA_GROUP_ID') ?? 'message-consumer',
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, KafkaService],
  exports: [MessageService],
})
export class MessageModule {}
