import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './controllers/notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Partitioners } from 'kafkajs';
import { NotificationListener } from './notification.listener';
import { NotificationDispatcher } from './notification.dispatcher';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId:
                config.get<string>('KAFKA_CLIENT_ID') ?? 'notification-service',
              brokers: [config.get<string>('KAFKA_BROKER') ?? 'localhost:9092'],
            },
            consumer: {
              groupId: config.get<string>('KAFKA_GROUP_ID') ?? 'user-consumer',
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [NotificationController, NotificationListener],
  providers: [NotificationService, NotificationDispatcher, NotificationGateway],
})
export class NotificationModule {}
