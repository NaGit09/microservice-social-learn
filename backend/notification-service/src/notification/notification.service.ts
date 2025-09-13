import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  getNotify() {
    return "Hello i'm notify";
  }
}
