// src/notifications/commands/like-post.command.ts
import { NotificationService } from '../notification.service';
import { Types } from 'mongoose';
import { NotificationCommand } from './command.interface';
import { NotificationType } from '../enums/notification.type';
import { EntityType } from '../enums/entity.type';

export class CommentCommand implements NotificationCommand {
  constructor(
    private notificationService: NotificationService,
    private actorId: Types.ObjectId,
    private receiverId: Types.ObjectId,
    private entityId: Types.ObjectId,
    private entityType: EntityType,
    private notificationType: NotificationType,
    private content: string,
    private tag: string,
  ) {}

  async excute(): Promise<void> {
    await this.notificationService.create({
      actor: this.actorId,
      receiver: this.receiverId,
      entityId: this.entityId,
      entityType: this.entityType,
      type: this.notificationType,
      metadata: { Content: this.content, tag: this.tag },
    });
  }
}
