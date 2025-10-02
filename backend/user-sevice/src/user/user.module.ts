import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserKafka } from './kafka/user.kafka';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { Profile, ProfileSchema } from './schema/profile.schema';
import { KafkaService } from './kafka/config.kafka';
import { UserController } from './user.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
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
              clientId: config.get<string>('KAFKA_CLIENT_ID') ?? 'user-service',
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
  controllers: [UserController, UserKafka],
  providers: [UserService, KafkaService],
})
export class UserModule {}
