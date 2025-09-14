import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { Post, PostDocument } from './entities/post.entity';
import { File } from './entities/file.entity';
import { PostMode } from './enums/post.enum';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SharePostDto } from './dto/share-post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}
  //
  async create(dto: CreatePostDto): Promise<Post> {
    const { author, files, mode, caption, isShare, sharePost } = dto;

    // Nếu là bài share thì phải check post gốc
    if (isShare && sharePost) {
      const oldPost = await this.postModel.findById(sharePost).exec();
      if (!oldPost) {
        throw new NotFoundException(`Post ${sharePost} not found`);
      }
    }

    const newPost = new this.postModel({
      author,
      files,
      caption,
      mode,
      isShare,
      sharePost: isShare ? sharePost : null,
    });

    return newPost.save();
  }
  //
  async edit(dto: UpdatePostDto): Promise<Post> {
    const { postId, filesToAdd, filesToRemove, caption, mode } = dto;

    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`);
    }

    if (filesToRemove?.length) {
      post.files = post.files.filter((f) => !filesToRemove.includes(f.fileId));
    }

    if (filesToAdd?.length) {
      post.files.push(...(filesToAdd as File[]));
    }

    if (caption !== undefined) {
      post.caption = caption;
    }

    if (mode !== undefined) {
      post.mode = mode as PostMode;
    }

    return post.save();
  }
  //
  async delete(postId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`);
    }

    // Gửi event tới Kafka (có thể thêm cả postId cho rõ ràng)
    this.kafkaClient.emit('post.delete', {
      files: post.files,
    });

    await post.deleteOne();
    return { message: `Post ${postId} deleted successfully` };
  }
  //
  async getById(postId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    return post;
  }
  //
  async getByAuthor(authorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.postModel.find({ author: authorId }).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments({ author: authorId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  //
  async totalPost(authorId: string): Promise<number> {
    return await this.postModel.countDocuments({ author: authorId });
  }
  async sharePost(share: SharePostDto): Promise<Post> {
    const { author, mode, caption, isShare, sharePost } = share;

    // Kiểm tra post gốc tồn tại
    const originalPost = await this.postModel.findById(sharePost).exec();
    if (!originalPost) {
      throw new NotFoundException('The post to share does not exist');
    }

    const newPost = new this.postModel({
      author,
      mode,
      caption,
      isShare, // bài share luôn là true
      sharePost: sharePost,
    });
    const savedPost = await newPost.save();
    return savedPost.populate('sharePost');
  }
}
