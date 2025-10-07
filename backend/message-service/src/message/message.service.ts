import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import {
  converstaion,
  ConverstaionDocument,
} from './entities/conversation.entity';
import { KafkaService } from './kafka/config.kafka';

@Injectable()
export class MessageService {
  constructor(
    @Inject() private client: KafkaService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(converstaion.name)
    private conversationModel: Model<ConverstaionDocument>,
  ) {}
}
