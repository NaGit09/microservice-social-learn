import { Controller } from '@nestjs/common';
import { NotificationDispatcher } from './notification.dispatcher';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LikeDtoSchema } from './dto/like.dto';
import { FollowDtoSchema } from './dto/follow.dto';
import { CommentDtoSchema } from './dto/comment.dto';
import { EntityType } from './enums/entity.type';
import { NotificationType } from './enums/notification.type';
import {
  mapToCommentCommand,
  mapToFollowCommand,
  mapToLikeCommand,
  mapToPostCommand,
} from './utils/mapper.util';
import { ShareDtoSchema } from './dto/share.dto';

@Controller()
export class NotificationListener {
  constructor(
    private dispatcher: NotificationDispatcher,
    private service: NotificationService,
  ) {}
  // handle user like post
  @EventPattern('like-post')
  async handleLikePostEvent(@Payload() event: unknown) {
    const dto = LikeDtoSchema.parse(event);
    const content = 'đã thích bài viết của bạn :'.concat(dto.entitytitle);
    const command = mapToLikeCommand(
      dto,
      content,
      this.service,
      EntityType.POST,
      NotificationType.LIKE_POST,
    );
    await this.dispatcher.dispatch(command);
  }
  // handle user like comment
  @EventPattern('like-comment')
  async handleLikeCommentEvent(@Payload() event: unknown) {
    const dto = LikeDtoSchema.parse(event);
    const content = 'đã thích bình luận của bạn :'.concat(dto.entitytitle);
    const command = mapToLikeCommand(
      dto,
      content,
      this.service,
      EntityType.COMMENT,
      NotificationType.LIKE_COMMENT,
    );
    await this.dispatcher.dispatch(command);
  }
  // handle user follow
  @EventPattern('follow-user')
  async handleFollowUserEvent(@Payload() event: unknown) {
    const dto = FollowDtoSchema.parse(event);
    const content = 'đã bắt đầu theo dõi bạn .';
    const command = mapToFollowCommand(
      dto,
      content,
      this.service,
      EntityType.FOLLOW,
      NotificationType.FOLLOW_USER,
    );
    await this.dispatcher.dispatch(command);
  }
  // hanlde user send follow request
  @EventPattern('follow-request')
  async handleRequestFollowEvent(@Payload() event: unknown) {
    const dto = FollowDtoSchema.parse(event);
    const content = 'đã gửi yêu cầu theo dõi bạn .';
    const command = mapToFollowCommand(
      dto,
      content,
      this.service,
      EntityType.FOLLOW,
      NotificationType.FOLLOW_REQUEST,
    );
    await this.dispatcher.dispatch(command);
  }
  // handle user accept follow request
  @EventPattern('follow-accept')
  async handleAcceptFollowEvent(@Payload() event: unknown) {
    const dto = FollowDtoSchema.parse(event);
    const content = 'đã chấp nhận yêu cầu theo dõi bạn .';
    const command = mapToFollowCommand(
      dto,
      content,
      this.service,
      EntityType.FOLLOW,
      NotificationType.FOLLOW_ACCEPT,
    );
    await this.dispatcher.dispatch(command);
  }
  //
  @EventPattern('comment-post')
  async handleCommentPostEvent(@Payload() event: unknown) {
    const dto = CommentDtoSchema.parse(event);
    const content = 'đã bình luận về bài viết của bạn :';
    const command = mapToCommentCommand(
      dto,
      content,
      this.service,
      EntityType.COMMENT,
      NotificationType.COMMENT_POST,
    );
    await this.dispatcher.dispatch(command);
  }
  //
  @EventPattern('comment-reply')
  async handleReplyCommentEvent(@Payload() event: unknown) {
    const dto = CommentDtoSchema.parse(event);
    const content = 'trả lời  bình luận của bạn :'.concat(dto.entityTitle);
    const command = mapToCommentCommand(
      dto,
      content,
      this.service,
      EntityType.COMMENT,
      NotificationType.REPLY_COMMENT,
    );
    await this.dispatcher.dispatch(command);
  }
  //
  @EventPattern('share-post')
  async handleSharePostEvent(@Payload() event: unknown) {
    const dto = ShareDtoSchema.parse(event);
    const content = 'đã chia sẽ bài viết của bạn :'.concat(dto.entityTitle);
    const command = mapToPostCommand(
      dto,
      content,
      this.service,
      EntityType.POST,
      NotificationType.SHARE_POST,
    );
    await this.dispatcher.dispatch(command);
  }
}
