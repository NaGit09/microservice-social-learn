import {
  HttpException,
  HttpStatus,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {  InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConverstaionDocument,
} from 'src/common/schema/conversation.entity';
import { Message, MessageDocument } from 'src/common/schema/message.entity';

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
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConverstaionDocument>,
  ) { }
  // get converstaion with pagination
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
      this.logger.error('Error getting conversations:', error);
      throw new HttpException(
        'Failed to retrieve conversations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // create new conversation 
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
      this.logger.log(error);
      throw new HttpException(
        'Server error while creating conversation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // accept conversation if it is a personal conversation
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
      this.logger.error("Accept conversation failed with ID  : ", convId)
      throw new HttpException(
        'Conversation not found, is not pending, or you are not a participant.',
        HttpStatus.NOT_FOUND
      );

    }
    return true;
  }
  // rename conversation if user is a owner 
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
      this.logger.error("Rename conversation failed with ID :", convId)
      throw new NotFoundException(
        `Conversation with ID "${convId}" not found or you don't have permission.`,
      );
    }
    return true;
  }
  // change avatar for a conversation 
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
      this.logger.error("Change avatar is failed with ID :", convId);
      throw new NotFoundException(
        `Group conversation with ID "${convId}" not found or you don't have permission.`,
      );
    }
    return true;
  }
  // change owner for a converstaion 
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
      this.logger.error("Change owner is failed , with ID :", convId);
      throw new BadRequestException(
        'Conversation not found, you are not the owner, or the new owner is not a participant.',
      );
    }
    return true;
  }
  // pin message 
  async pinMessage(dto: PinMessageDto): Promise<boolean> {
    const { convId, messageId, userId } = dto;

    const messageExists = await this.messageModel.findOne({
      _id: messageId,
      convId,
    });
    if (!messageExists) {
      this.logger.error("Pin message is failed with ID :", convId);
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
  // ban user in conversation
  async banUser(dto: BanUserDto): Promise<boolean> {
    const { convId, owner, userBan } = dto;

    if (owner === userBan) {
      this.logger.warn(`Attempt by owner ${owner} to ban themselves in convId ${convId}.`);
      throw new BadRequestException('Owner cannot ban themselves.');
    }

    const updatedConversation = await this.conversationModel.findOneAndUpdate(
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
      {
        new: true
      }
    ).exec();

    if (!updatedConversation) {
      this.logger.warn(`Ban action failed for convId: ${convId}. Actor: ${owner}, Target: ${userBan}. Conditions not met.`);
      throw new ForbiddenException(
        'Action failed: Conversation not found, you are not the owner, or the user is not a participant.',
      );
    }

    this.logger.error(`User ${userBan} was successfully banned from convId ${convId} by owner ${owner}.`);
    return true;
  }
  // return list userId
  async getUsers(senderId: string, convId: string): Promise<string[]> {
    const conversation = await this.conversationModel.findOne(
      {
        _id: convId,
        participants: senderId
      },
      { participants: 1, _id: 0 }
    ).exec();

    if (!conversation) {
      return [];
    }

    return conversation.participants;
  }
  // add user in conversation
  async addParticipants(dto: UpdatePaticipantsDto): Promise<boolean> {
    const { userIds, convId } = dto;

    try {
      const result = await this.conversationModel.updateOne(
        {
          _id: convId,
          isBan: { $nin: userIds },
        },
        {
          $addToSet: { participants: { $each: userIds } },
        }
      ).exec();

      if (result.matchedCount === 0) {
        this.logger.error(`Conversation not found or one of the users is banned.`);
        return false;
      }

      this.logger.error(`Update successful. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
      return true;

    } catch (error) {
      this.logger.error("Error adding participants:", error);
      return false;
    }
  }
  // remove user in conversation 
  async removeParticipants(dto: UpdatePaticipantsDto): Promise<boolean> {
    const { userIds, convId } = dto;
    const conversation = await this.conversationModel.findById(convId).exec();

    if (!conversation) {
      this.logger.error(`Conversation with id ${convId} not found!`);
      return false;
    }

    try {
      const usersToRemove = userIds.filter(
        (id) => conversation.participants.includes(id)
      );

      if (usersToRemove.length === 0) {
        this.logger.log("All users already existed in the conversation!");
        return true;
      }

      conversation.participants.filter((p) => !usersToRemove.includes(p))

      await conversation.save();
      this.logger.log(`Added ${usersToRemove.length} new participants.`);
      return true;

    } catch (error) {
      this.logger.error("Error adding participants:", error);
      return false;
    }
  }
  // check user in conversation
  async checkUser (userId: string , convId: string) : Promise<boolean> {

    const filter = {
      _id: convId, 
      participants: userId 
    };
    
    const exists = await this.conversationModel.exists(filter).exec();
    
    if(!exists ) return false;
    return true;
  }
}
