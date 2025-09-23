import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotificationService } from '../notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get(':id')
  async get(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    return this.notificationService.get(id, Number(page), Number(size));
  }
}
