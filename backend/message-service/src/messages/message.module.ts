import {  Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'src/common/schema/message.entity';
import { MessageService } from './message.service';
import {
  Conversation,
  ConversationSchema,
} from 'src/common/schema/conversation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService ],
  exports: [MessageService],
})
export class MessageModule { }
