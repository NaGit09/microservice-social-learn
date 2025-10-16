import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Message, MessageDocument } from 'src/common/schema/message.entity';
import {
  Conversation,
  ConverstaionDocument,
} from 'src/common/schema/conversation.entity';

import { CreateMessageDto } from 'src/common/dto/messages/create-message';
import { ReactMessageDto } from 'src/common/dto/messages/react-message';
import { RecallMessageDto } from 'src/common/dto/messages/recall-message';
import { MessageStatus } from 'src/common/enums/message.enum';
import { ForwardMessageDto } from 'src/common/dto/messages/forward-message';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConverstaionDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  async get(convId: string, requesterId: string, page: number, size: number) {
    const conversation = await this.conversationModel.findOne({
      _id: convId,
      participants: requesterId,
    });
    if (!conversation) {
      throw new ForbiddenException(
        'You do not have access to this conversation.',
      );
    }

    const skip = (page - 1) * size;
    const [data, total] = await Promise.all([
      this.messageModel
        .find({ convId: convId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .populate('reply')
        .exec(),
      this.messageModel.countDocuments({ convId: convId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
  async create(dto: CreateMessageDto) {
    const { convId, content, file, senderId, replyId } = dto;
    let acceptReply = false;
    try {
      const conversation = await this.conversationModel.findOne({
        _id: convId,
        participants: senderId,
      });

      if (!conversation) {
        throw new ForbiddenException(
          'You are not a participant of this conversation.',
        );
      }

      if (senderId) {
        const parentMessage = await this.messageModel.findOne({
          senderId: senderId,
          convId,
        });
        if (parentMessage && replyId) {
          acceptReply = true;
        }
      }

      const message = new this.messageModel({
        convId,
        content,
        senderId: senderId,
        file,
        reply: acceptReply ? replyId : null,
      });
      await message.save();

      conversation.lastest = message;
      await conversation.save();

      return message;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
  async react(dto: ReactMessageDto) {
    const { messageId, react, senderId } = dto;

    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found!');

    const conversation = await this.conversationModel.findOne({
      _id: message.convId,
      participants: senderId,
    });
    if (!conversation)
      throw new ForbiddenException(
        'You cannot react to a message in this conversation.',
      );

    const updatedMessage = await this.messageModel.findByIdAndUpdate(
      messageId,
      [
        {
          $set: {
            reacts: {
              $filter: {
                input: '$reacts',
                as: 'reaction',
                cond: { $ne: ['$$reaction.userId', senderId] },
              },
            },
          },
        },
        {
          $set: {
            reacts: {
              $concatArrays: ['$reacts', [react]],
            },
          },
        },
      ],
      { new: true },
    );

    return updatedMessage;
  }
  async recall(dto: RecallMessageDto) {
    const { messageId, senderId } = dto;

    const updatedMessage = await this.messageModel.findOneAndUpdate(
      {
        _id: messageId,
        senderId: senderId,
      },
      {
        content: 'message is recalled !',
        file: null,
        status: MessageStatus.RECALLED,
        reacts: [],
      },
      { new: true },
    );

    if (!updatedMessage) {
      throw new ForbiddenException(
        'Message not found or you are not the sender.',
      );
    }
    return updatedMessage;
  }
  async forward(dto: ForwardMessageDto) {
    const { messageId, convIds, userForward } = dto;
    const createdMessages: Message[] = [];

    const originalMessage = await this.messageModel.findById(messageId);
    if (!originalMessage) {
      throw new NotFoundException('Original message not found.');
    }

    for (const convId of convIds) {
      try {
        const conversation = await this.conversationModel.findOne({
          _id: convId,
          participants: userForward,
        });

        if (!conversation) {
          this.logger.warn(
            `User ${userForward} is not a participant of conversation ${convId}. Skipping forward.`,
          );
          return;
        }

        const forwardMessage = new this.messageModel({
          convId: convId,
          content: originalMessage.content,
          file: originalMessage.file,
          senderId: userForward,
          isForward: true,
        });
        await forwardMessage.save();

        conversation.lastest = forwardMessage;
        await conversation.save();

        createdMessages.push(forwardMessage);
      } catch (error) {
        this.logger.error(
          `Failed to forward message to convId ${convId}:`,
          error,
        );
        throw error;
      }
    }
    return createdMessages;
  }
}
