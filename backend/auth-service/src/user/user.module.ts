import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserKafka } from './kafka/user.kafka';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Profile, ProfileSchema } from './schema/profile.schema';
import { UserController } from './user.controller';
import { KafkaModule } from 'src/kafka/module.kafka';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
   KafkaModule,
  ],
  controllers: [UserController, UserKafka],
  providers: [UserService],
})
export class UserModule {}
