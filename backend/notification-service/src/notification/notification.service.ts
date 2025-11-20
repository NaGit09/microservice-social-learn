import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { Model, Types } from 'mongoose';
import { NotificationGateway } from './notification.gateway';
import { ApiResponse } from './types/api-resp';
import { NotificationPagination } from './types/notification.type';
import { RedisService } from './redis/config.redis';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    
    private readonly gateway: NotificationGateway,
    private readonly redis : RedisService,
  ) {}
  //Create new notification and push it into user with receiverId
  async create(data: Partial<Notification>): Promise<Notification> {
    const notify = new this.notificationModel(data);
    
    await notify.save();
    // Trong notification.service.ts
    if (notify.receiver) {
      // Đảm bảo toString() để khớp với tên Room
      this.gateway.sendNotification(notify.receiver.toString(), notify);
    }
    this.logger.log('Create new notify with action ');
    return notify;
  }

  async get(userId: string, page: number, size: number)
    : Promise<ApiResponse<NotificationPagination>> {
    const skip = (page - 1) * size;
    const objectId = new Types.ObjectId(userId);

    const [data, total] = await Promise.all([
      this.notificationModel
        .find({ receiver: objectId })
        .populate({
          path: 'actor',           
          select: 'username avatar' 
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .exec(),
      this.notificationModel.countDocuments({ receiver: objectId }).exec(),
    ]);
 
    const notificationResp: NotificationPagination = {
      data: data,
      pagination: {
        total: total,
        page: page,
        limit: size,
        totalPages : total
      }
    }
    return {
      statusCode: 200,
      data: notificationResp,
      message : "get notification successfully"
    }
  }
  async read(id: string) {
    const notification = await this.notificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      this.logger.warn(`Notification with id=${id} not found`);
      return false;
    }

    this.logger.log(`Notification ${id} marked as read`);
    return true;
  }
}
