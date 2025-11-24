import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import {
  Conversation,
  ConversationSchema,
} from 'src/common/schema/conversation.entity';
import { Message, MessageSchema } from 'src/common/schema/message.entity';
import { KafkaService } from 'src/kafka/config.kafka';
import { MessageModule } from 'src/messages/message.module';
import { RedisService } from 'src/redis/config.redis';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    KafkaService,
    RedisService,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService]
})

export class ConversationModule { }
