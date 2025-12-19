
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../common/entities/account';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) { }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.accountModel.find().select('-password').skip(skip).limit(limit).exec(),
            this.accountModel.countDocuments().exec(),
        ]);
        return {
            statusCode: 200,
            message: 'Get all users successfully',
            data: {
                users,
                meta: {
                    total,
                    page,
                    lastPage: Math.ceil(total / limit),
                },
            }
        };
    }

    async delete(id: string) {
        await this.accountModel.findByIdAndDelete(id).exec();
        return {
            statusCode: 200,
            message: 'Delete user successfully',
            data: true
        };
    }

    async getUserStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisYear = new Date(now.getFullYear(), 0, 1);

        const [day, month, year] = await Promise.all([
            this.accountModel.countDocuments({ createdAt: { $gte: today } }).exec(),
            this.accountModel.countDocuments({ createdAt: { $gte: thisMonth } }).exec(),
            this.accountModel.countDocuments({ createdAt: { $gte: thisYear } }).exec(),
        ]);

        return {
            statusCode: 200,
            message: 'Get user stats successfully',
            data: {
                day,
                month,
                year
            }
        };
    }
}
