// src/notifications/commands/like-post.command.ts
import { NotificationService } from '../notification.service';
import { NotificationCommand } from './command.interface';
import { NotificationType } from '../enums/notification.type';
import { EntityType } from '../enums/entity.type';

export class FollowCommand implements NotificationCommand {
  constructor(
    private notificationService: NotificationService,
    private actorId: string,
    private receiverId: string,
    private entityId: string,
    private entityType: EntityType,
    private notificationType: NotificationType,
    private content: string,
  ) {}

  async excute(): Promise<void> {
    await this.notificationService.create({
      actor: this.actorId,
      receiver: this.receiverId,
      entityId: this.entityId,
      entityType: this.entityType,
      type: this.notificationType,
      metadata: { Content: this.content },
    });
  }
}
