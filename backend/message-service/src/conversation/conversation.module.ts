import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import {
  Conversation,
  ConversationSchema,
} from 'src/common/schema/conversation.entity';
import { Message, MessageSchema } from 'src/common/schema/message.entity';
import { KafkaModule } from 'src/kafka/module.kafka';
import { RedisModule } from 'src/redis/module.redis';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    KafkaModule,
    RedisModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService]
})

export class ConversationModule { }
