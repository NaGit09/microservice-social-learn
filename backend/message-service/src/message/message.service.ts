import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Connection, Model } from 'mongoose';
import {
  Conversation,
  ConverstaionDocument,
} from './entities/conversation.entity';
import { KafkaService } from './kafka/config.kafka';
import { ConversationDto } from './dto/request/create-conv';
import { RenameConvDto } from './dto/request/rename-conv';
import { AvatarConvDto } from './dto/request/avatar-conv';
import { OwnerConvDto } from './dto/request/owner-conv';
import { PinMessageDto } from './dto/request/pin-message';
import { BanUserDto } from './dto/request/ban-user';
import { AcceptConvDto } from './dto/request/accept-conv';
import { MessageDto } from './dto/request/create-message';
import { MessageGateway } from './message.gateway';
// import { ReplyMessageDto } from './dto/request/reply-message';

@Injectable()
export class MessageService {
  constructor(
    private readonly socket: MessageGateway,
    @Inject() private client: KafkaService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConverstaionDocument>,
    @InjectConnection() private readonly connection: Connection, // Inject the connection
  ) {}
  //
  hello() {
    return 'hello from message service';
  }
  // create new conversation
  async createConversation(dto: ConversationDto) {
    // 1. Start a session for the transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // 2. Create the conversation instance (don't save yet)
      const newConversation = new this.conversationModel({
        participantIds: dto.participants,
        isGroup: dto.isGroup,
        name: dto.name,
        owner: dto.owner,
        status: dto.isGroup ? 'accepted' : 'pending',
      });

      // 3. Create the initial message, if it exists
      if (dto.latest) {
        const newMessage = new this.messageModel({
          convId: newConversation._id,
          senderId: dto.latest.senderId,
          content: dto.latest.content,
          file: dto.latest.file,
        });

        // 4. Link the message back to the conversation
        newConversation.lastest = newMessage._id.toString();

        // 5. Save both documents within the transaction
        await Promise.all([
          newConversation.save({ session }),
          newMessage.save({ session }),
        ]);
      } else {
        // If there's no initial message, just save the conversation
        await newConversation.save({ session });
      }

      // 6. If all saves succeed, commit the transaction
      await session.commitTransaction();
      return newConversation;
    } catch (error) {
      // 7. If any error occurs, abort the transaction
      await session.abortTransaction();
      // Re-throw the error to be handled by NestJS error filters
      throw error;
    } finally {
      // 8. Always end the session
      await session.endSession();
    }
  }
  //
  async acceptConversation(dto: AcceptConvDto): Promise<boolean> {
    const { convId, userId } = dto;

    // 1. Find the conversation by its ID.
    const conversation = await this.conversationModel.findById(convId).exec();

    // 2. Perform validation checks.
    if (!conversation) {
      throw new HttpException(
        `Conversation with ID "${convId}" not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!conversation.participants.includes(userId)) {
      throw new HttpException(
        'You are not a participant in this conversation.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (conversation.status !== 'pending') {
      throw new HttpException(
        'This conversation is not pending and cannot be accepted.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3. Update the status to active.
    conversation.status = 'accepted';

    // 4. Save the document and return it.
    await conversation.save();
    return true;
  }
  //
  async renameConversation(dto: RenameConvDto): Promise<boolean> {
    const { convId, newName } = dto;

    const conversation = await this.conversationModel.findById(convId).exec();

    if (!conversation) {
      throw new HttpException(
        `Conversation with ID "${convId}" not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    conversation.name = newName;
    return true;
  }
  //
  async changeAvatarGroup(dto: AvatarConvDto): Promise<boolean> {
    const { convId, file } = dto;
    const conversation = await this.conversationModel.findById(convId).exec();
    if (!conversation) {
      throw new HttpException(
        `Conversation with ID "${convId}" not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    conversation.file = file;
    return true;
  }
  //
  async changeOwnerGroup(dto: OwnerConvDto): Promise<boolean> {
    const { convId, oldOwner, newOwner } = dto;

    // 1. Find the conversation by its ID.
    const conversation = await this.conversationModel.findById(convId).exec();

    // 2. Handle edge cases and verify permissions.
    if (!conversation) {
      throw new HttpException(
        `Conversation with ID "${convId}" not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!conversation.isGroup) {
      throw new HttpException(
        'Cannot change owner of a non-group chat.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (conversation.owner !== oldOwner) {
      throw new HttpException(
        'You are not the current owner of this group.',
        HttpStatus.FORBIDDEN,
      );
    }
    if (!conversation.participants.includes(newOwner)) {
      throw new HttpException(
        'The new owner must be a participant in the group.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3. Update the owner and save the document.
    conversation.owner = newOwner;

    await conversation.save();
    return true;
  }
  //
  async pinMessage(dto: PinMessageDto): Promise<boolean> {
    const { convId, messageId } = dto;

    // 1. Find the target conversation
    const conversation = await this.conversationModel.findById(convId).exec();

    if (!conversation) {
      throw new HttpException(
        `Conversation with ID "${convId}" not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 2. Verify the message exists AND belongs to this conversation
    const messageExists = await this.messageModel.exists({
      _id: messageId,
      convId: convId, // This is the crucial check
    });

    if (!messageExists) {
      throw new HttpException(
        `Message with ID "${messageId}" not found in this conversation.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3. Update the pinnedMessage field and save
    conversation.pin = messageId;
    await conversation.save();

    return true;
  }
  //
  async banUser(dto: BanUserDto): Promise<boolean> {
    const { convId, owner, userBan } = dto;

    // 1. Find the conversation
    const conversation = await this.conversationModel.findById(convId).exec();

    // 2. Perform validation checks
    if (!conversation) {
      throw new HttpException(
        `Conversation with ID "${convId}" not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!conversation.isGroup) {
      throw new HttpException(
        'You can only ban users from a group chat.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 3. Check permissions: The user performing the action must be an owner or admin.
    const isOwner = conversation.owner.toString() === owner;
    if (!isOwner) {
      throw new HttpException(
        'You do not have permission to ban users in this group.',
        HttpStatus.FORBIDDEN,
      );
    }
    // 4. Validate the target user
    if (userBan === conversation.owner.toString()) {
      throw new HttpException(
        'The group owner cannot be banned.',
        HttpStatus.FORBIDDEN,
      );
    }
    if (!conversation.participants.includes(userBan)) {
      throw new HttpException(
        'The target user is not a participant in this group.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 5. Perform the ban action
    // Remove the user from participants
    conversation.participants = conversation.participants.filter(
      (id) => id !== userBan,
    );
    // Add the user to the banned list (if not already there)
    if (!conversation.isBan.includes(userBan)) {
      conversation.isBan.push(userBan);
    }

    // 6. Save the changes
    await conversation.save();

    return true;
  }
  //
  async createMessage(dto: MessageDto): Promise<MessageDocument> {
    const { convId, content, file, senderId } = dto;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const conversation = await this.conversationModel
        .findById(convId)
        .session(session);

      if (!conversation) {
        throw new HttpException(
          `Conversation with ID "${convId}" not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (conversation.isBan.includes(senderId)) {
        throw new HttpException(
          'You are banned from this conversation.',
          HttpStatus.FORBIDDEN,
        );
      }
      if (!conversation.participants.includes(senderId)) {
        throw new HttpException(
          'The new owner must be a participant in the group.',
          HttpStatus.FORBIDDEN,
        );
      }

      // 2. Create the new message instance
      const newMessage = new this.messageModel({
        convId,
        senderId,
        content,
        file, // Map DTO field to schema field
      });

      // 3. Update the conversation's latestMessage field
      conversation.lastest = newMessage._id.toString();

      // 4. Save both documents concurrently within the transaction
      const [savedMessage] = await Promise.all([
        newMessage.save({ session }),
        conversation.save({ session }),
      ]);

      // 5. Commit the transaction if all saves are successful
      await session.commitTransaction();

      // 6. Emit the WebSocket event AFTER the transaction is committed
      this.socket.sendMessage(conversation.participants, savedMessage);

      return savedMessage;
    } catch (error) {
      // If any error occurs, abort the entire transaction
      await session.abortTransaction();
      throw error; // Re-throw the error to be handled by NestJS
    } finally {
      // Always end the session to prevent leaks
      await session.endSession();
    }
  }
  //
  // async replyMessage(dto: ReplyMessageDto) {
  //   const { convId, messageId, message } = dto;
  // }
}
