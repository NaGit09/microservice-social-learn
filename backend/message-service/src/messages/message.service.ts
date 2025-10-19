import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { EditMessageDto } from 'src/common/dto/messages/edit-message';
import { ReadMessageDto } from 'src/common/dto/messages/read-message';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConverstaionDocument>,
  ) { }
  // get message with pagination 
  async get(convId: string, requesterId: string, page: number, size: number) {

    try {
      const accessCheck = await this.conversationModel.countDocuments({
        _id: convId,
        participants: requesterId,
      }).exec();

      if (accessCheck === 0) {
        this.logger.warn(`Access denied for user ${requesterId} attempting to access convId ${convId}.`);
        throw new HttpException(
          'You do not have access to this conversation.',
          HttpStatus.FORBIDDEN
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
    } catch (error) {
      throw new HttpException(
        'You do not have access to this conversation.',
        HttpStatus.FORBIDDEN
      );
    }
  }
  // create a new message 
  async create(dto: CreateMessageDto) {
    const { convId, content, file, senderId, replyId } = dto;

    try {
      const isParticipant = await this.conversationModel.countDocuments({
        _id: convId,
        participants: senderId,
      }).exec();

      if (isParticipant === 0) {
        this.logger.warn(`Forbidden: Sender ${senderId} is not a participant of convId ${convId}.`);
        throw new HttpException(
          'You are not a participant of this conversation.',
          HttpStatus.NOT_FOUND
        );
      }

      if (replyId) {
        const parentMessageExists = await this.messageModel.countDocuments({
          _id: replyId,
          convId: convId,
        }).exec();

        if (parentMessageExists === 0) {
          this.logger.warn(`Message creation failed: Reply message with id ${replyId} not found in convId ${convId}.`);
          throw new HttpException(`The message you are trying to reply to does not exist.`, HttpStatus.BAD_REQUEST);
        }
      }

      const message = new this.messageModel({
        convId,
        content,
        senderId,
        file,
        reply: replyId || null,
      });

      const [savedMessage] = await Promise.all([
        message.save(),
        this.conversationModel.updateOne(
          { _id: convId },
          { $set: { lastest: message._id } }
        ).exec()
      ]);

      return savedMessage;

    } catch (error) {
      this.logger.error(`Error creating message in convId ${convId}:`, error.stack);
      throw error;
    }
  }
  // react a message
  async react(dto: ReactMessageDto) {
    const { messageId, react } = dto;

    try {
      const message = await this.messageModel.findById(messageId)
        .select('convId')
        .lean()
        .exec();

      if (!message) {
        this.logger.warn(`Reaction failed: Message ${messageId} not found.`);
        throw new HttpException('Message not found!', HttpStatus.NOT_FOUND);
      }

      const hasAccess = await this.conversationModel.countDocuments({
        _id: message.convId,
        participants: react.userId,
      }).exec();

      if (hasAccess === 0) {
        this.logger.warn(`Forbidden: User ${react.userId} cannot react in convId ${message.convId}.`);
        throw new HttpException('You cannot react to a message in this conversation.', HttpStatus.BAD_REQUEST);
      }

      let updateOperation;

      if (react && react.reactType) {

        updateOperation = {
          $pull: { reacts: { userId: react.userId, reactType: react.reactType } },
        };
        await this.messageModel.findByIdAndUpdate(messageId, updateOperation).exec();

        updateOperation = {
          $push: { reacts: react },
        };

      } else {
        updateOperation = {
          $pull: { reacts: { userId: react.userId, reactType: react.reactType } },
        };
      }

      const updatedMessage = await this.messageModel.findByIdAndUpdate(
        messageId,
        updateOperation,
        { new: true }
      ).exec();

      return updatedMessage;

    } catch (error) {
      this.logger.error(`Failed to process reaction for message ${messageId}:`, error.stack);
      throw error;
    }
  }
  // recall a message 
  async recall(dto: RecallMessageDto) {
    const { messageId, senderId } = dto;

    try {
      const updatedMessage = await this.messageModel.findOneAndUpdate(
        {
          _id: messageId,
          senderId: senderId,
        },
        {
          content: 'This message has been recalled.',
          file: null,
          status: MessageStatus.RECALLED,
          reacts: [],
        },
        { new: true }
      ).exec();

      if (!updatedMessage) {
        this.logger.warn(`Recall failed: Message ${messageId} not found or sender ${senderId} is not the owner.`);
        throw new HttpException(
          'Message not found or you are not the sender.',
          HttpStatus.FORBIDDEN
        );
      }

      return updatedMessage;

    } catch (error) {
      this.logger.error(`An unexpected error occurred while recalling message ${messageId}:`, error.stack);
      throw error;
    }
  }
  // forward message to conversation 
  async forward(dto: ForwardMessageDto) {
    const { messageId, convIds, userForward } = dto;

    try {
      const originalMessage = await this.messageModel.findById(messageId).lean().exec();
      if (!originalMessage) {
        this.logger.warn(`Forward failed: Original message ${messageId} not found.`);
        throw new HttpException('Original message not found.', HttpStatus.NOT_FOUND);
      }

      const validConvs = await this.conversationModel.find({
        _id: { $in: convIds },
        participants: userForward,
      })
        .select('_id')
        .lean()
        .exec();

      const validConvIds = validConvs.map(c => c._id.toString());

      if (validConvIds.length < convIds.length) {
        const skippedIds = convIds.filter(id => !validConvIds.includes(id));
        this.logger.warn(`User ${userForward} is not a participant of conversations, skipping: ${skippedIds.join(', ')}.`);
      }

      if (validConvIds.length === 0) {
        return [];
      }

      const messagesToCreate = validConvIds.map(convId => ({
        convId: convId,
        content: originalMessage.content,
        file: originalMessage.file,
        senderId: userForward,
        isForward: true,
      }));

      const createdMessages = await this.messageModel.insertMany(messagesToCreate);

      const updateOperations = createdMessages.map(message => ({
        updateOne: {
          filter: { _id: message.convId },
          update: { $set: { lastest: message._id } }
        }
      }));

      await this.conversationModel.bulkWrite(updateOperations);

      return createdMessages;

    } catch (error) {
      this.logger.error(`An unexpected error occurred during message forwarding for user ${userForward}:`, error.stack);
      throw error;
    }
  }

  async edit(dto: EditMessageDto) {
    const { messageId, convId, newContent, senderId } = dto;

    const fiveMinutesAgo = new Date(Date.now() - (5 * 60 * 1000));

    const message = await this.messageModel.findOneAndUpdate(
      {
        id: messageId,
        convId,
        senderId: senderId,
        createdAt: { $gte: fiveMinutesAgo }
      },
      {
        content: newContent,
        isEdited: true
      },
      { new: true }
    ).exec();

    if (!message) {
      this.logger.error("Edit message failed! (Not found or time expired)");

      throw new HttpException(
        "Edit message failed! Message not found or edit time has expired.",
        HttpStatus.BAD_REQUEST
      );
    }

    return message;
  }

  async read(dto: ReadMessageDto) {
    const { messageId, convId, senderId } = dto;
  }
}
