import {  Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'src/common/schema/message.entity';
import { MessageService } from './message.service';
import {
  Conversation,
  ConversationSchema,
} from 'src/common/schema/conversation.entity';
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
  controllers: [MessageController],
  providers: [MessageService ],
  exports: [MessageService],
})
export class MessageModule { }
