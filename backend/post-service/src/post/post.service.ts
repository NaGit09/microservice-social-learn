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
import mongoose, { Model } from 'mongoose';
import { KafkaService } from 'src/kafka/config.kafka';
import { Post, PostDocument } from 'src/common/entities/post.entity';
import { CreatePostDto } from 'src/common/dto/post/create';
import { SharePostDto } from 'src/common/dto/post/share';
import { UpdatePostDto } from 'src/common/dto/post/update';
import { File } from 'src/common/entities/file.entity';
import { CommentService } from 'src/comment/comment.service';
import { LikeService } from 'src/like/like.service';
import {
  AuthorInforResp,
  PostResp,
  RootPostResp,
} from 'src/common/types/post-resp';
import { Pagination } from 'src/common/types/pagination-resp';
import { ApiResponse } from 'src/common/types/api-resp';

@Injectable()
export class PostService {
  constructor(
    @Inject(forwardRef(() => LikeService))
    private readonly like: LikeService,

    @Inject(forwardRef(() => CommentService))
    private readonly comment: CommentService,

    private readonly kafka: KafkaService,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) { }
  //
  async create(dto: CreatePostDto): Promise<Post> {
    const { author, files, mode, caption, isShare, sharePost } = dto;

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
  async delete(postId: string): Promise<ApiResponse<boolean>> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new HttpException(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
    }

    await post.deleteOne();
    void this.comment.deletePost(post.id as string);
    this.kafka.emit(
      'post-delete',
      post.files.map((f) => f.fileId),
    );
    return {
      statusCode: 200,
      message: `Post ${postId} deleted successfully`,
      data: true,
    };
  }
  //
  async getById(postId: string): Promise<ApiResponse<Post>> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: 200,
      message: 'Get post by id successfully',
      data: post,
    };
  }
  //
  async getPostByAuthor(
    authorId: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<RootPostResp>> {
    const skip = (page - 1) * limit;

    const isValidObjectId = mongoose.isValidObjectId(authorId);
    const matchStage: mongoose.PipelineStage = isValidObjectId
      ? {
        $match: {
          $or: [
            { author: authorId },
            { author: new mongoose.Types.ObjectId(authorId) },
          ],
        },
      }
      : { $match: { author: authorId } };

    const likesCollectionName = 'likes';
    const commentsCollectionName = 'comments';

    const postLikeType = 'post';

    const dataPipeline: mongoose.PipelineStage[] = [
      matchStage,

      { $sort: { createdAt: -1 } },

      { $skip: skip },
      { $limit: limit },

      {
        $addFields: {
          postIdAsString: { $toString: '$_id' },
        },
      },

      {
        $lookup: {
          from: likesCollectionName,
          let: { pId: '$postIdAsString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$targetId', '$$pId'] },
                    { $eq: ['$targetType', postLikeType] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'likeData',
        },
      },

      {
        $lookup: {
          from: commentsCollectionName,
          let: { pId: '$postIdAsString' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$postId', '$$pId'] },
                    { $eq: ['$isRoot', true] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'commentData',
        },
      },

      {
        $addFields: {
          totalLike: { $ifNull: [{ $arrayElemAt: ['$likeData.count', 0] }, 0] },
          totalComment: {
            $ifNull: [{ $arrayElemAt: ['$commentData.count', 0] }, 0],
          },
        },
      },
      {
        $project: {
          postIdAsString: 0,
          likeData: 0,
          commentData: 0,
        },
      },
    ];
    const countFilter = isValidObjectId
      ? {
        $or: [
          { author: authorId },
          { author: new mongoose.Types.ObjectId(authorId) },
        ],
      }
      : { author: authorId };

    const [data, total] = await Promise.all([
      this.postModel.aggregate(dataPipeline).exec(),
      this.postModel.countDocuments(countFilter).exec(),
    ]);
    const newResp = data.map(
      (p) =>
        new PostResp(
          p as Post,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          p.totalLike as number,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          p.totalComment as number,
        ),
    );
    console.log(data);

    const pagination = new Pagination(total, page, limit);
    const postResp = new RootPostResp(newResp, pagination);
    return {
      statusCode: 200,
      message: ' Get post with user id successfully',
      data: postResp,
    };
  }
  //
  async totalPost(authorId: string): Promise<ApiResponse<number>> {
    const isValidObjectId = mongoose.isValidObjectId(authorId);
    const countFilter = isValidObjectId
      ? {
        $or: [
          { author: authorId },
          { author: new mongoose.Types.ObjectId(authorId) },
        ],
      }
      : { author: authorId };
    const total = await this.postModel.countDocuments(countFilter);

    return {
      data: total,
      statusCode: 200,
      message: 'Total posts retrieved successfully',
    };
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
