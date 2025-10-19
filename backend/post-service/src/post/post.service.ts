import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostMode } from '../common/enums/post.enum';
import { Model } from 'mongoose';
import { KafkaService } from 'src/kafka/config.kafka';
import { Post, PostDocument } from 'src/common/entities/post.entity';
import { CreatePostDto } from 'src/common/dto/post/create';
import { SharePostDto } from 'src/common/dto/post/share';
import { UpdatePostDto } from 'src/common/dto/post/update';
import { File } from 'src/common/entities/file.entity';
import { AuthorInforResp } from 'src/common/dto/response/author.resp';
import { CommentService } from 'src/comment/comment.service';
import { LikeService } from 'src/like/like.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(forwardRef(() => LikeService))
    private readonly like: LikeService,
    
    @Inject(forwardRef(() => CommentService))
    private readonly comment: CommentService,  
    
    private readonly kafkaClient: KafkaService,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) { }
  //
  async create(dto: CreatePostDto): Promise<Post> {
    const { author, files, mode, caption, isShare, sharePost } = dto;

    // Nếu là bài share thì phải check post gốc
    if (isShare && sharePost) {
      const oldPost = await this.postModel.findById(sharePost).exec();
      if (!oldPost) {
        throw new HttpException(
          `Post ${sharePost} not found`,
          HttpStatus.NOT_FOUND,
        );
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
  async sharePost(share: SharePostDto): Promise<Post> {
    const { author, mode, caption, isShare, sharePost } = share;

    const originalPost = await this.postModel.findById(sharePost).exec();
    if (!originalPost) {
      throw new HttpException(
        'The post to share does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const newPost = new this.postModel({
      author,
      mode,
      caption,
      isShare,
      sharePost: sharePost,
    });
    const savedPost = await newPost.save();
    return savedPost.populate('sharePost');
  }
  //
  async edit(dto: UpdatePostDto): Promise<Post> {
    const { postId, filesToAdd, filesToRemove, caption, mode } = dto;

    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new HttpException(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
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
      throw new HttpException(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
    }

    await post.deleteOne();
    this.comment.deletePost(post.id);
    return { message: `Post ${postId} deleted successfully` };
  }
  //
  async getById(postId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    return post;
  }
  //
  async getPostByAuthor(authorId: string, page = 1, size = 10) {
    const skip = (page - 1) * size;
    const [data, total] = await Promise.all([
      this.postModel.find({ author: authorId }).skip(skip).limit(size).exec(),
      this.postModel.countDocuments({ author: authorId }).exec(),
    ]);

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
  //
  async totalPost(authorId: string): Promise<number> {
    return await this.postModel.countDocuments({ author: authorId });
  }
  async getAuthorInfo(postId: string): Promise<AuthorInforResp> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    return {
      authorId: post.author,
      caption: post.caption,
    };
  }
}
