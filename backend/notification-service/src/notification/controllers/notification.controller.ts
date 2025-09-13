import { Controller, Get } from '@nestjs/common';
import { NotificationService } from '../notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  getNotify() {
    return this.notificationService.getNotify();
  }
}
