import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FileType } from './enums/file.enum';
import { ClientKafka } from '@nestjs/microservices';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { AuthorInforResp } from './dto/author.resp';

@Injectable()
export class CommentService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  //
  async create(dto: CreateCommentDto): Promise<Comment> {
    const { file, userId, postId, content, tag } = dto;
    const comment = new this.commentModel({
      userId,
      postId,
      content,
      tag,
      file: file ?? null,
      isEdit: false,
    });
    return comment.save();
  }
  //
  async update(dto: UpdateCommentDto): Promise<Comment> {
    const { commentId, file, content, tag } = dto;
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException(`Comment not found: ${commentId}`);
    }

    if (content !== undefined) {
      comment.content = content;
    }

    if (tag !== undefined) {
      comment.tag = tag;
    }

    if (file !== undefined) {
      comment.file = {
        ...file,
        type: file.type as FileType,
      }; // replace file cũ bằng file mới
    }

    // Đánh dấu comment đã edit
    comment.isEdit = true;

    return comment.save();
  }
  //
  async delete(id: string) {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment not found: ${id}`);
    }

    // Emit event xóa file nếu có file đính kèm
    if (comment.file) {
      this.kafkaClient.emit('comment.delete', comment.file);
    }

    await comment.deleteOne();

    return {
      message: 'Comment deleted successfully',
      deletedId: id,
    };
  }
  //
  async reply(dto: ReplyCommentDto): Promise<Comment> {
    const { isRoot, reply, content, userId, postId, tag, file } = dto;
    const root = await this.commentModel.findById(reply).exec();
    if (!root) {
      throw new NotFoundException('comment not found');
    }
    if (!root.isRoot) {
      throw new ConflictException('comment is not root');
    }
    const replyComment = new this.commentModel({
      reply,
      isRoot: isRoot,
      content,
      userId,
      postId,
      tag,
      file,
    });
    return replyComment.save();
  }
  //
  async deletePost(postId: string) {
    const result = await this.commentModel.deleteMany({ postId }).exec();
    return {
      deletedCount: result.deletedCount ?? 0,
      postId,
    };
  }
  //
  async getCommentRoot(postId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { postId, isRoot: true } }, // chỉ comment gốc
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'reply',
          as: 'replies',
        },
      },
      {
        $addFields: {
          replyCount: { $size: '$replies' },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          replies: 0, // không trả về danh sách reply, chỉ count thôi
        },
      },
    ];

    const [comments, total] = await Promise.all([
      this.commentModel.aggregate(pipeline as any[]).exec(),
      this.commentModel.countDocuments({ postId, isRoot: true }).exec(),
    ]);

    return {
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //
  async getReplyComment(parentCommentId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [replies, total] = await Promise.all([
      this.commentModel
        .find({ reply: parentCommentId }) // lấy reply của comment cha
        .sort({ createdAt: 1 }) // hiển thị theo thứ tự cũ → mới
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ reply: parentCommentId }).exec(),
    ]);

    return {
      data: replies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async total(postId: string): Promise<number> {
    return await this.commentModel.countDocuments({ postId }).exec();
  }
  // retrun user infor owner post
  async getAuthorInfo(postId: string): Promise<AuthorInforResp> {
    const comment = await this.commentModel.findById(postId).exec();
    if (!comment) {
      throw new NotFoundException('Post does not exist');
    }
    return {
      authorId: comment.userId.toString(),
      caption: comment.content,
    };
  }
}
