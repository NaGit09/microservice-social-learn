import { Controller, Inject, Logger } from '@nestjs/common';
import { NotificationDispatcher } from './notification.dispatcher';
import { NotificationService } from './notification.service';
import {
  EventPattern,
  Payload,
  Ctx,
  KafkaContext,
  ClientKafka,
} from '@nestjs/microservices';
import { LikeDtoSchema } from './dto/like.dto';
import { ZodSchema } from 'zod';
import { EntityType } from './enums/entity.type';
import { NotificationType } from './enums/notification.type';
import {
  mapToFollowCommand,
  mapToLikeCommand,
  mapToPostCommand,
} from './utils/mapper.util';
import { FollowDtoSchema } from './dto/follow.dto';
import { ShareDtoSchema } from './dto/share.dto';
import { CommentDtoSchema } from './dto/comment.dto';

@Controller()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    private dispatcher: NotificationDispatcher,
    private service: NotificationService,
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
  ) {}

  private async handleEvent(
    event: unknown,
    context: KafkaContext,
    config: {
      schema: ZodSchema<any>;
      mapper: (...args: any[]) => any;
      content: (dto: any) => string;
      entityType: EntityType;
      notificationType: NotificationType;
      dlqTopic: string;
    },
  ) {
    const originalMessage = context.getMessage();
    try {
      const dto = config.schema.parse(event);

      const content = config.content(dto);

      const command = config.mapper(
        dto,
        content,
        this.service,
        config.entityType,
        config.notificationType,
      );
      await this.dispatcher.dispatch(command);

      this.logger.log(
        `Successfully processed [${config.notificationType}] for offset ${originalMessage.offset}`,
      );
    } catch (error) {
      this.logger.error(
        `[${config.notificationType}] Failed to process offset ${originalMessage.offset}: ${error.message}`,
        error.stack,
      );

      const dlqPayload = {
        originalMessage,
        error: {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        },
      };

      try {
        await this.client.emit(config.dlqTopic, dlqPayload).toPromise();
        this.logger.log(
          `Message offset ${originalMessage.offset} sent to DLQ [${config.dlqTopic}].`,
        );
      } catch (dlqError) {
        this.logger.error(
          `CRITICAL: Failed to send message to DLQ: ${dlqError.message}`,
        );
        throw dlqError;
      }
    }
  }
  // Like event pattern
  @EventPattern('like-post')
  async handleLikePostEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: LikeDtoSchema,
      mapper: mapToLikeCommand,
      content: (dto) => 'đã thích bài viết của bạn :'.concat(dto.entitytitle),
      entityType: EntityType.POST,
      notificationType: NotificationType.LIKE_POST,
      dlqTopic: 'like-post.DLQ',
    });
  }

  @EventPattern('like-comment')
  async handleLikeCommentEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: LikeDtoSchema,
      mapper: mapToLikeCommand,
      content: (dto) => 'đã thích bình luận của bạn :'.concat(dto.entitytitle),
      entityType: EntityType.COMMENT,
      notificationType: NotificationType.LIKE_COMMENT,
      dlqTopic: 'like-comment.DLQ',
    });
  }
  // Follow event pattern
  @EventPattern('follow-user')
  async handleFollowUserEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: FollowDtoSchema,
      mapper: mapToFollowCommand,
      content: () => 'đã bắt đầu theo dõi bạn .',
      entityType: EntityType.FOLLOW,
      notificationType: NotificationType.FOLLOW_USER,
      dlqTopic: 'follow-user.DLQ',
    });
  }

  @EventPattern('follow-request')
  async handleFollowRequestEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: FollowDtoSchema,
      mapper: mapToFollowCommand,
      content: () => 'đã gửi yêu cầu theo dõi bạn .',
      entityType: EntityType.FOLLOW,
      notificationType: NotificationType.FOLLOW_REQUEST,
      dlqTopic: 'follow-request.DLQ',
    });
  }

  @EventPattern('follow-accept')
  async handleFollowAcceptEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: FollowDtoSchema,
      mapper: mapToFollowCommand,
      content: () => 'đã chấp nhiên yêu cầu  theo dõi của bạn .',
      entityType: EntityType.FOLLOW,
      notificationType: NotificationType.FOLLOW_ACCEPT,
      dlqTopic: 'follow-accept.DLQ',
    });
  }
  // Post event pattern
  @EventPattern('share-post')
  async handleSharePostEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: ShareDtoSchema,
      mapper: mapToPostCommand,
      content: () => 'đã chia sẽ bài viết của bạn .',
      entityType: EntityType.POST,
      notificationType: NotificationType.SHARE_POST,
      dlqTopic: 'share-post.DLQ',
    });
  }
  // Comment event pattern 
  @EventPattern('comment-post')
  async handleCommnetPostEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: CommentDtoSchema,
      mapper: mapToFollowCommand,
      content: () => 'đã bình luận  bài viết của bạn .',
      entityType: EntityType.COMMENT,
      notificationType: NotificationType.COMMENT_POST,
      dlqTopic: 'comment-post.DLQ',
    });
  }

  @EventPattern('reply-comment')
  async handleReplyCommentEvent(
    @Payload() event: unknown,
    @Ctx() context: KafkaContext,
  ) {
    await this.handleEvent(event, context, {
      schema: CommentDtoSchema,
      mapper: mapToFollowCommand,
      content: () => 'đã trả lời bình luận của bạn .',
      entityType: EntityType.COMMENT,
      notificationType: NotificationType.REPLY_COMMENT,
      dlqTopic: 'reply-comment.DLQ',
    });
  }
}
