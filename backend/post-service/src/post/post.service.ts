import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
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
  SharePostNotify,
} from 'src/common/types/post-resp';
import { Pagination } from 'src/common/types/pagination-resp';
import { ApiResponse } from 'src/common/types/api-resp';
import { TargetType } from 'src/common/enums/targetType.enum';
import { RedisService } from 'src/redis/config.redis';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @Inject(forwardRef(() => LikeService))
    private readonly like: LikeService,

    @Inject(forwardRef(() => CommentService))
    private readonly comment: CommentService,

    private readonly kafka: KafkaService,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,

    private readonly redis : RedisService,
  ) {}
  //
  async create(dto: CreatePostDto): Promise<ApiResponse<Post>> {
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

    await newPost.save();
    return {
      statusCode: 200,
      message: 'Create post successfully !',
      data: newPost,
    };
  }
  //
  async sharePost(share: SharePostDto): Promise<ApiResponse<Post>> {

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

    const ShareNotify = new SharePostNotify(newPost, originalPost.author);
    this.kafka.emit('share-post', ShareNotify);

    const savedPost = await newPost.save();

    try {
      await this.postModel
        .findByIdAndUpdate(
          sharePost,
          { $inc: { shares: 1 } },
        )
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to increment share count for post ${sharePost}: ${error.message}`,
      );
    }
    return {
      statusCode: 200,
      message: 'share post successfully !',
      data: savedPost,
    };
  }
  //
  async edit(dto: UpdatePostDto): Promise<ApiResponse<PostResp>> {
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

    await post.save();

    const { data: updatedPostWithCounts } = await this.getById(postId);

    return {
      statusCode: 200,
      message: 'Edit post successfully !',
      data: updatedPostWithCounts,
    };
  }
  //
  async delete(postId: string): Promise<ApiResponse<boolean>> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new HttpException(`Post ${postId} not found`, HttpStatus.NOT_FOUND);
    }

    const postFileIds = post.files
      .map((f) => f.fileId)
      .filter((id): id is string => !!id);
    //
    try {
      await post.deleteOne();
    } catch (dbError) {
      this.logger.error(
        `Failed to delete main post ${postId}: ${dbError.message}`,
      );
      throw new HttpException(
        'Failed to delete post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    //
    try {
      await this.like.deleteLikesByTarget([postId], TargetType.POST);
    } catch (likeError) {
      this.logger.warn(
        `Failed to delete associated comment likes for post ${postId}. Error: ${likeError.message}`,
      );
    }
    try {
      await this.comment.deleteAllCommentsForPost(post.id as string);
    } catch (commentError) {
      this.logger.warn(
        `Post ${postId} deleted, but failed to delete associated comments. 
        Error: ${commentError.message}`,
      );
    }
    if (postFileIds.length > 0) {
      try {
        this.kafka.emit('file-delete', postFileIds);
      } catch (kafkaError) {
        this.logger.warn(
          `Post ${postId} deleted, but failed to emit 'post-delete' event for files [${postFileIds.join(', ')}].
           Files may be orphaned. Error: ${kafkaError.message}`,
        );
      }
    }

    return {
      statusCode: 200,
      message: `Post ${postId} deleted successfully`,
      data: true,
    };
  }
  //
  async getById(postId: string): Promise<ApiResponse<PostResp>> {
    if (!mongoose.isValidObjectId(postId)) {
      throw new HttpException('Invalid Post ID', HttpStatus.BAD_REQUEST);
    }

    const postIdAsObjectId = new mongoose.Types.ObjectId(postId);

    const likesCollectionName = 'likes';
    const commentsCollectionName = 'comments';
    const postLikeType = 'post';

    const dataPipeline: mongoose.PipelineStage[] = [
      {
        $match: { _id: postIdAsObjectId },
      },

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
                  $and: [{ $eq: ['$postId', '$$pId'] }],
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

    const results = await this.postModel.aggregate(dataPipeline).exec();

    const post = results[0];

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
                  $and: [{ $eq: ['$postId', '$$pId'] }],
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

    const pagination = new Pagination(total, page, limit);
    const postResp = new RootPostResp(data, pagination);
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
  //
  async getAuthorInfo(postId: string): Promise<AuthorInforResp> {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    return {
      authorId: post.author ? post.author.toString() : 'null',
      caption: post.caption,
    };

  }
  //

  async getRandomPosts(count: number): Promise<ApiResponse<PostResp[]>> {
    const likesCollectionName = 'likes';
    const commentsCollectionName = 'comments';
    const postLikeType = 'post';
    const numericCount = Number(count);
    const dataPipeline: mongoose.PipelineStage[] = [
      { $sample: { size: numericCount } },

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
                  $and: [{ $eq: ['$postId', '$$pId'] }],
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

    const data = await this.postModel.aggregate(dataPipeline).exec();

    return {
      statusCode: 200,
      message: `Get ${data.length} random posts successfully`,
      data: data,
    };
  }
}
