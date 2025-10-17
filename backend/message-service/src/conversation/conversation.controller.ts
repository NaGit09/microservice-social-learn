import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import type { ConversationDto } from 'src/common/dto/conversation/create-conv';
import type { AcceptConvDto } from 'src/common/dto/conversation/accept-conv';
import type { RenameConvDto } from 'src/common/dto/conversation/rename-conv';
import type { AvatarConvDto } from 'src/common/dto/conversation/avatar-conv';
import type { OwnerConvDto } from 'src/common/dto/conversation/owner-conv';
import type { PinMessageDto } from 'src/common/dto/conversation/pin-message';
import type { BanUserDto } from 'src/common/dto/conversation/ban-user';
import type { UpdatePaticipantsDto } from 'src/common/dto/conversation/update-paticipants';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly service: ConversationService) { }
  @Get(':id')
  async getConv(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.getConversations(id, Number(page), Number(limit));
  }
  @Post('/create')
  async create(@Body() dto: ConversationDto) {
    return this.service.create(dto);
  }
  @Post('/accept')
  async accept(@Body() dto: AcceptConvDto) {
    return this.service.accept(dto);
  }
  @Patch('/rename')
  async rename(@Body() dto: RenameConvDto) {
    return this.service.rename(dto);
  }
  @Patch('/avatar')
  async changeAvatar(@Body() dto: AvatarConvDto) {
    return this.service.changeAvatarGroup(dto);
  }
  @Patch('/owner')
  async changeOwner(@Body() dto: OwnerConvDto) {
    return this.service.changeOwnerGroup(dto);
  }
  @Patch('/pin')
  async pinMessage(@Body() dto: PinMessageDto) {
    return this.service.pinMessage(dto);
  }
  @Patch('/ban')
  async banUser(@Body() dto: BanUserDto) {
    return this.service.banUser(dto);
  }
  @Patch('/paticipants/add')
  async addUsers(@Body() dto: UpdatePaticipantsDto) {
    return this.service.addParticipants(dto);
  }
  @Patch('/paticipants/remove')
  async removeUsers(@Body() dto: UpdatePaticipantsDto) {
    return this.service.removeParticipants(dto);
  }
}
