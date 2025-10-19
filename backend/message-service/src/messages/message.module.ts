import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'src/common/schema/message.entity';
import { MessageService } from './message.service';
import {
  Conversation,
  ConversationSchema,
} from 'src/common/schema/conversation.entity';
import { KafkaService } from 'src/kafka/config.kafka';
import { KafkaModule } from 'src/kafka/module.kafka';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    KafkaModule,
    ConversationModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, KafkaService],
  exports: [MessageService],
})
export class MessageModule { }
