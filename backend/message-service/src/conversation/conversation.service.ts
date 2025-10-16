import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import {
  Conversation,
  ConverstaionDocument,
} from 'src/common/schema/conversation.entity';
import { Message, MessageDocument } from 'src/common/schema/message.entity';
import { KafkaService } from 'src/services/config.kafka';

// Import all DTOs
import { ConversationDto } from '../common/dto/conversation/create-conv';
import { AcceptConvDto } from '../common/dto/conversation/accept-conv';
import { OwnerConvDto } from 'src/common/dto/conversation/owner-conv';
import { AvatarConvDto } from 'src/common/dto/conversation/avatar-conv';
import { PinMessageDto } from 'src/common/dto/conversation/pin-message';
import { BanUserDto } from 'src/common/dto/conversation/ban-user';
import { RenameConvDto } from 'src/common/dto/conversation/rename-conv';
import { ConversationStatus } from 'src/common/enums/conversation.enum';
import { UpdatePaticipantsDto } from 'src/common/dto/conversation/update-paticipants';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(KafkaService) private client: KafkaService, // Đổi tên cho rõ ràng
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConverstaionDocument>,
  ) { }
  async getConversations(userId: string, page: number, size: number) {
    try {
      const skipAmount = (page - 1) * size;

      const query = {
        participants: userId,
        status: ConversationStatus.ACCEPTED,
      };

      const [conversations, totalItems] = await Promise.all([
        this.conversationModel
          .find(query)
          .sort({ updatedAt: -1 })
          .skip(skipAmount)
          .limit(size)
          .exec(),
        this.conversationModel.countDocuments(query),
      ]);

      // Tính toán tổng số trang
      const totalPages = Math.ceil(totalItems / size);

      return {
        data: conversations,
        pagination: {
          page,
          size,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw new HttpException(
        'Failed to retrieve conversations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async create(dto: ConversationDto) {
    try {
      const newConversation = new this.conversationModel({
        participants: dto.participants,
        isGroup: dto.isGroup,
        name: dto.name,
        owner: dto.owner,
        status: dto.isGroup
          ? ConversationStatus.ACCEPTED
          : ConversationStatus.PENDING,
      });

      if (dto.latest) {
        const newMessage = new this.messageModel({
          convId: newConversation._id,
          senderId: dto.latest.senderId,
          content: dto.latest.content,
          file: dto.latest.file,
        });

        newConversation.lastest = newMessage;

        await Promise.all([newConversation.save(), newMessage.save()]);
      } else {
        await newConversation.save();
      }

      return newConversation;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Server error while creating conversation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async accept(dto: AcceptConvDto): Promise<boolean> {
    const { convId, userId } = dto;

    const updatedConversation = await this.conversationModel.findOneAndUpdate(
      {
        _id: convId,
        participants: userId,
        status: 'pending',
      },
      { status: 'accepted' },
      { new: true },
    );

    if (!updatedConversation) {
      throw new NotFoundException(
        'Conversation not found, is not pending, or you are not a participant.',
      );
    }
    return true;
  }

  async rename(dto: RenameConvDto): Promise<boolean> {
    const { convId, newName, userId } = dto;
    const updated = await this.conversationModel.findOneAndUpdate(
      {
        _id: convId,
        participants: userId,
      },
      { name: newName },
    );

    if (!updated) {
      throw new NotFoundException(
        `Conversation with ID "${convId}" not found or you don't have permission.`,
      );
    }
    return true;
  }

  async changeAvatarGroup(dto: AvatarConvDto): Promise<boolean> {
    const { convId, file, userId } = dto;
    const updated = await this.conversationModel.findOneAndUpdate(
      {
        _id: convId,
        isGroup: true,
        participants: userId,
      },
      { file: file },
    );

    if (!updated) {
      throw new NotFoundException(
        `Group conversation with ID "${convId}" not found or you don't have permission.`,
      );
    }
    return true;
  }

  async changeOwnerGroup(dto: OwnerConvDto): Promise<boolean> {
    const { convId, oldOwner, newOwner } = dto;

    const updated = await this.conversationModel.findOneAndUpdate(
      {
        _id: convId,
        isGroup: true,
        owner: oldOwner,
        participants: newOwner,
      },
      { owner: newOwner },
    );

    if (!updated) {
      throw new BadRequestException(
        'Conversation not found, you are not the owner, or the new owner is not a participant.',
      );
    }
    return true;
  }

  async pinMessage(dto: PinMessageDto): Promise<boolean> {
    const { convId, messageId, userId } = dto;

    const messageExists = await this.messageModel.findOne({
      _id: messageId,
      convId,
    });
    if (!messageExists) {
      throw new BadRequestException(
        `Message with ID "${messageId}" not found in this conversation.`,
      );
    }

    const updated = await this.conversationModel.findOneAndUpdate(
      { _id: convId, participants: userId },
      { pin: messageId },
    );

    if (!updated) {
      throw new NotFoundException(
        'Conversation not found or you are not a participant.',
      );
    }
    return true;
  }

  async banUser(dto: BanUserDto): Promise<boolean> {
    const { convId, owner, userBan } = dto;

    if (owner === userBan) {
      throw new BadRequestException('Owner cannot ban themselves.');
    }

    const updated = await this.conversationModel.findOneAndUpdate(
      {
        _id: convId,
        isGroup: true,
        owner: owner,
        participants: userBan,
      },
      {
        $pull: { participants: userBan },
        $addToSet: { isBan: userBan },
      },
    );

    if (!updated) {
      throw new ForbiddenException(
        'Action failed: Conversation not found, you are not the owner, or the user is not a participant.',
      );
    }
    return true;
  }
  async getUsers(id: string): Promise<string[]> {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      return [];
    }
    return conversation.participants
  }
  //
  async addParticipants(dto: UpdatePaticipantsDto): Promise<boolean> {
    const {userIds , convId} = dto;
    const conversation = await this.conversationModel.findById(convId).exec();
    
    if (!conversation) {
      console.error(`Conversation with id ${convId} not found!`);
      return false;
    }
  
    try {
      const usersToAdd = userIds.filter(
        (id) => !conversation.participants.includes(id)
      );
  
      if (usersToAdd.length === 0) {
        console.log("All users already existed in the conversation!");
        return true;
      }
  
      conversation.participants.push(...usersToAdd);
  
      await conversation.save();
      console.log(`Added ${usersToAdd.length} new participants.`);
      return true;
  
    } catch (error) {
      console.error("Error adding participants:", error);
      return false;
    }
  }
  async removeParticipants(dto: UpdatePaticipantsDto): Promise<boolean> {
    const {userIds , convId} = dto;
    const conversation = await this.conversationModel.findById(convId).exec();
    
    if (!conversation) {
      console.error(`Conversation with id ${convId} not found!`);
      return false;
    }
  
    try {
      const usersToRemove = userIds.filter(
        (id) => conversation.participants.includes(id)
      );
  
      if (usersToRemove.length === 0) {
        console.log("All users already existed in the conversation!");
        return true;
      }
  
      conversation.participants.filter((p) => !usersToRemove.includes(p))
  
      await conversation.save();
      console.log(`Added ${usersToRemove.length} new participants.`);
      return true;
  
    } catch (error) {
      console.error("Error adding participants:", error);
      return false;
    }
  }
}
