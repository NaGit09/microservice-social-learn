import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { Model } from 'mongoose';
// import { NotificationSocket } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    // private readonly gateway: NotificationSocket,
  ) {}
  create(data: Partial<Notification>): Promise<Notification> {
    const notify = new this.notificationModel(data);
    // this.gateway.sendNotification(notify.receiver.toString(), notify);
    return notify.save();
  }
  async get(userId: string, page: number, size: number) {
    const skip = (page - 1) * size;
    const [data, total] = await Promise.all([
      this.notificationModel
        .find({ receiver: userId })
        .skip(skip)
        .limit(size)
        .exec(),
      this.notificationModel.countDocuments({ receiver: userId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
