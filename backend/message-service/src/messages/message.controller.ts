// src/message/message.controller.ts

import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
import { MessageService } from './message.service';
import type { RecallMessageDto } from 'src/common/dto/messages/recall-message';
import type { ReactMessageDto } from 'src/common/dto/messages/react-message';
import type { ForwardMessageDto } from 'src/common/dto/messages/forward-message';
import type { CreateMessageDto } from 'src/common/dto/messages/create-message';

@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Get(':convId')
  async getMessages(
    @Param('convId') convId: string,
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
  ) {
    return this.service.get(convId, userId, page, size);
  }
  @Post('/create')
  async create(@Body() dto: CreateMessageDto) {
    return this.service.create(dto);
  }
  @Patch('/recall')
  async recall(@Body() dto: RecallMessageDto) {
    return this.service.recall(dto);
  }
  @Patch('/react')
  async react(@Body() dto: ReactMessageDto) {
    return this.service.react(dto);
  }
  @Post('/forward')
  async forward(@Body() dto: ForwardMessageDto) {
    return this.service.forward(dto);
  }
}
