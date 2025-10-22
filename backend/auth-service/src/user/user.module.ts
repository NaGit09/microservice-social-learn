import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from 'src/common/entities/user';
import { Profile, ProfileSchema } from 'src/common/entities/profile';
import { KafkaModule } from 'src/kafka/module.kafka';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    KafkaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
