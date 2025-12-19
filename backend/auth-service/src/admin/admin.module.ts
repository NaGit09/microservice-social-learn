
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../common/entities/account';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
