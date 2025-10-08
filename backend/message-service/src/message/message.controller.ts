import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get()
  hello() {
    return this.messageService.hello();
  }
}
