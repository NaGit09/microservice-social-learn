
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../common/entities/post.entity';
import { Comment, CommentDocument } from '../common/entities/comment.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    ) { }

    // Posts
    async findAllPosts(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.postModel.find().skip(skip).limit(limit).exec(),
            this.postModel.countDocuments().exec(),
        ]);
        return {
            statusCode: 200,
            message: 'Get posts successfully',
            data: {
                posts,
                meta: {
                    total,
                    page,
                    lastPage: Math.ceil(total / limit),
                },
            }
        };
    }

    async deletePost(id: string) {
        await this.postModel.findByIdAndDelete(id).exec();
        return {
            statusCode: 200,
            message: 'Delete post successfully',
            data: true
        };
    }

    // Comments
    async findAllComments(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            this.commentModel.find().skip(skip).limit(limit).exec(),
            this.commentModel.countDocuments().exec(),
        ]);
        return {
            statusCode: 200,
            message: 'Get comments successfully',
            data: {
                comments,
                meta: {
                    total,
                    page,
                    lastPage: Math.ceil(total / limit),
                },
            }
        };
    }

    async deleteComment(id: string) {
        await this.commentModel.findByIdAndDelete(id).exec();
        return {
            statusCode: 200,
            message: 'Delete comment successfully',
            data: true
        };
    }

    async getPostStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisYear = new Date(now.getFullYear(), 0, 1);

        const [day, month, year] = await Promise.all([
            this.postModel.countDocuments({ createdAt: { $gte: today } }).exec(),
            this.postModel.countDocuments({ createdAt: { $gte: thisMonth } }).exec(),
            this.postModel.countDocuments({ createdAt: { $gte: thisYear } }).exec(),
        ]);

        return {
            statusCode: 200,
            message: 'Get post stats successfully',
            data: {
                day,
                month,
                year
            }
        };
    }
}
