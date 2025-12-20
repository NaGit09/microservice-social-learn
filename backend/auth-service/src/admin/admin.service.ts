
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../common/entities/account';
import * as bcrypt from 'bcrypt';
import type { AdminResetPasswordDto } from '../common/dto/admin/reset-password.dto';

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
        const totalUsers = await this.accountModel.countDocuments();

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const newUsersToday = await this.accountModel.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Aggregate users by month for the current year
        const usersByMonth = await this.accountModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(now.getFullYear(), 0, 1), // Start of this year
                        $lte: new Date(now.getFullYear(), 11, 31) // End of this year
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Fill in missing months with 0
        const monthlyData = Array(12).fill(0);
        usersByMonth.forEach(item => {
            monthlyData[item._id - 1] = item.count;
        });

        return {
            statusCode: 200,
            message: 'Get user stats successfully',
            data: {
                totalUsers,
                newUsersToday,
                monthlyData
            }
        };
    }

    async banUser(id: string) {
        const account = await this.accountModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).exec();

        if (!account) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null
            };
        }

        return {
            statusCode: 200,
            message: 'Ban user successfully',
            data: true
        };
    }

    async updatePermissions(id: string, permissions: string[]) {
        const account = await this.accountModel.findByIdAndUpdate(
            id,
            { permissions },
            { new: true }
        ).exec();

        if (!account) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null
            };
        }

        return {
            statusCode: 200,
            message: 'Update permissions successfully',
            data: true
        };
    }

    async resetUserPassword(dto: AdminResetPasswordDto) {
        const { userId, newPassword } = dto;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const account = await this.accountModel.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        ).exec();

        if (!account) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null
            };
        }

        return {
            statusCode: 200,
            message: 'Password reset successfully by admin',
            data: true
        };
    }
}
