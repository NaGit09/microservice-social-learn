
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../common/entities/post.entity';
import { Comment, CommentSchema } from '../common/entities/comment.entity';
import { Like, LikeSchema } from '../common/entities/like.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/utils/jwt.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Like.name, schema: LikeSchema }
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
    ],
    controllers: [AdminController],
    providers: [AdminService, JwtStrategy],
})
export class AdminModule { }
