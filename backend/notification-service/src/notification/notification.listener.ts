// src/notifications/notification.listener.ts
import { Controller } from '@nestjs/common';
import { NotificationDispatcher } from './notification.dispatcher';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { LikeCommand } from './command/like.command';
import { LikeDtoSchema } from './dto/like.dto';
import { FollowDtoSchema } from './dto/follow.dto';
import { CommentDtoSchema } from './dto/comment.dto';
import { CommentCommand } from './command/comment.command';
import { EntityType } from './enums/entity.type';
import { NotificationType } from './enums/notification.type';

@Controller()
export class NotificationListener {
  constructor(
    private dispatcher: NotificationDispatcher,
    private notificationService: NotificationService,
  ) {}
  @EventPattern('like-post')
  async handleLikePostEvent(@Payload() event: unknown) {
    const dto = LikeDtoSchema.parse(event);
    const content = 'đã thích bài viết của bạn :'.concat(dto.entitytitle);
    const command = new LikeCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.entityId),
      EntityType.POST,
      NotificationType.LIKE_POST,
      content,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('like-comment')
  async handleLikeCommentEvent(@Payload() event: unknown) {
    const dto = LikeDtoSchema.parse(event);
    const content = 'đã thích bình luận của bạn :'.concat(dto.entitytitle);
    const command = new LikeCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.entityId),
      EntityType.COMMENT,
      NotificationType.LIKE_COMMENT,
      content,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('follow-user')
  async handleFollowUserEvent(@Payload() event: unknown) {
    const dto = FollowDtoSchema.parse(event);
    const content = 'đã bắt đầu theo dõi bạn .';
    const command = new LikeCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.actorId),
      EntityType.FOLLOW,
      NotificationType.FOLLOW_USER,
      content,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('follow-request')
  async handleRequestFollowEvent(@Payload() event: unknown) {
    const dto = FollowDtoSchema.parse(event);
    const content = 'đã gửi yêu cầu theo dõi bạn .';
    const command = new LikeCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.actorId),
      EntityType.FOLLOW,
      NotificationType.FOLLOW_ACCEPT,
      content,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('follow-accept')
  async handleAcceptFollowEvent(@Payload() event: unknown) {
    const dto = FollowDtoSchema.parse(event);
    const content = 'đã chấp nhận yêu cầu theo dõi bạn .';
    const command = new LikeCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.actorId),
      EntityType.FOLLOW,
      NotificationType.FOLLOW_ACCEPT,
      content,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('comment-post')
  async handleCommentPostEvent(@Payload() event: unknown) {
    const dto = CommentDtoSchema.parse(event);
    const content = 'đã bình luận về bài viết của bạn :';
    const command = new CommentCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.entityId),
      EntityType.COMMENT,
      NotificationType.COMMENT_POST,
      content,
      dto.tag,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('comment-reply')
  async handleReplyCommentEvent(@Payload() event: unknown) {
    const dto = CommentDtoSchema.parse(event);
    const content = 'trả lời  bình luận của bạn :'.concat(dto.entityTitle);
    const command = new CommentCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.entityId),
      EntityType.COMMENT,
      NotificationType.REPLY_COMMENT,
      content,
      dto.tag,
    );
    await this.dispatcher.dispatch(command);
  }
  @EventPattern('share-post')
  async handleSharePostEvent(@Payload() event: unknown) {
    const dto = CommentDtoSchema.parse(event);
    const content = 'đã chia sẽ bài viết của bạn :'.concat(dto.entityTitle);
    const command = new CommentCommand(
      this.notificationService,
      new Types.ObjectId(dto.actorId),
      new Types.ObjectId(dto.receiverId),
      new Types.ObjectId(dto.entityId),
      EntityType.COMMENT,
      NotificationType.REPLY_COMMENT,
      content,
      dto.tag,
    );
    await this.dispatcher.dispatch(command);
  }
}
