import { LikeCommand } from '../command/like.command';
import { LikeDto } from '../dto/like.dto';
import { FollowDto } from '../dto/follow.dto';
import { NotificationService } from '../notification.service';
import { EntityType } from '../enums/entity.type';
import { NotificationType } from '../enums/notification.type';
import { FollowCommand } from '../command/follow.command';
import { CommentDto } from '../dto/comment.dto';
import { CommentCommand } from '../command/comment.command';
import { ShareDto } from '../dto/share.dto';
import { ShareCommand } from '../command/share.command';
// mapper to like command
export function mapToLikeCommand(
  dto: LikeDto,
  content: string,
  notificationService: NotificationService,
  entityType: EntityType,
  notificationType: NotificationType,
): LikeCommand {
  return new LikeCommand(
    notificationService,
    dto.actorId,
    dto.receiverId,
    dto.entityId,
    entityType,
    notificationType,
    content,
  );
}
// mapper to follow command
export function mapToFollowCommand(
  dto: FollowDto,
  content: string,
  notificationService: NotificationService,
  entityType: EntityType,
  notificationType: NotificationType,
): FollowCommand {
  return new FollowCommand(
    notificationService,
    dto.actorId,
    dto.receiverId,
    dto.id,
    entityType,
    notificationType,
    content,
  );
}
// mapper to comment command
export function mapToCommentCommand(
  dto: CommentDto,
  content: string,
  notificationService: NotificationService,
  entityType: EntityType,
  notificationType: NotificationType,
): CommentCommand {
  return new CommentCommand(
    notificationService,
    dto.actorId,
    dto.receiverId,
    dto.receiverId,

    entityType,
    notificationType,
    content,
  );
}
// mapper to share post command
export function mapToPostCommand(
  dto: ShareDto,
  content: string,
  notificationService: NotificationService,
  entityType: EntityType,
  notificationType: NotificationType,
): ShareCommand {
  return new ShareCommand(
    notificationService,
    dto.actorId,
    dto.receiverId,
    dto.receiverId,
    entityType,
    notificationType,
    content,
  );
}
