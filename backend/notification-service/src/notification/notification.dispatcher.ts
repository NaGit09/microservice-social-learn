import { Injectable } from '@nestjs/common';
import { NotificationCommand } from './command/command.interface';

@Injectable()
export class NotificationDispatcher {
  async dispatch(command: NotificationCommand): Promise<void> {
    await command.excute();
  }
}
