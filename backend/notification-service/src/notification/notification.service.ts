import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { Model, Types } from 'mongoose';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly gateway: NotificationGateway,
  ) {}
  //Create new notification and push it into user with receiverId
  create(data: Partial<Notification>): Promise<Notification> {
    const notify = new this.notificationModel(data);
    if (notify.receiver) {
      this.gateway.sendNotification(notify.receiver.toString(), notify);
    }
    this.logger.log('Create new notify with action ');
    return notify.save();
  }
  async get(userId: string, page: number, size: number) {
    const skip = (page - 1) * size;
    const objectId = new Types.ObjectId(userId);

    const [data, total] = await Promise.all([
      this.notificationModel
        .find({ receiver: objectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .exec(),
      this.notificationModel.countDocuments({ receiver: objectId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
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
