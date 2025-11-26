import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { getModelToken } from '@nestjs/mongoose';
import { Like } from '../common/entities/like.entity';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { KafkaService } from '../kafka/config.kafka';
import { CreateLikeDto } from '../common/dto/like/like';
import { TargetType } from '../common/enums/targetType.enum';

describe('LikeService', () => {
    let service: LikeService;
    let likeModel: any;
    let postService: any;
    let commentService: any;
    let kafkaService: any;

    const mockLikeModel = {
        findOne: jest.fn(),
        deleteOne: jest.fn(),
        create: jest.fn(),
        countDocuments: jest.fn(),
        deleteMany: jest.fn(),
    };

    const mockPostService = {
        getAuthorInfo: jest.fn(),
    };

    const mockCommentService = {
        getAuthorInfo: jest.fn(),
    };

    const mockKafkaService = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LikeService,
                {
                    provide: getModelToken(Like.name),
                    useValue: mockLikeModel,
                },
                {
                    provide: PostService,
                    useValue: mockPostService,
                },
                {
                    provide: CommentService,
                    useValue: mockCommentService,
                },
                {
                    provide: KafkaService,
                    useValue: mockKafkaService,
                },
            ],
        }).compile();

        service = module.get<LikeService>(LikeService);
        likeModel = module.get(getModelToken(Like.name));
        postService = module.get(PostService);
        commentService = module.get(CommentService);
        kafkaService = module.get(KafkaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('like', () => {
        const dto: CreateLikeDto = {
            userId: 'user1',
            targetId: 'post1',
            targetType: TargetType.POST,
        };

        it('should unlike if like already exists', async () => {
            const mockQuery = {
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ _id: 'like1' }),
            };
            mockLikeModel.findOne.mockReturnValue(mockQuery);

            mockLikeModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const result = await service.like(dto);

            expect(mockLikeModel.findOne).toHaveBeenCalledWith({
                userId: dto.userId,
                targetId: dto.targetId,
                targetType: dto.targetType,
            });
            expect(mockQuery.select).toHaveBeenCalledWith('_id');
            expect(mockLikeModel.deleteOne).toHaveBeenCalledWith({ _id: 'like1' });
            expect(result.data).toBe(false);
            expect(result.message).toContain('Unliked');
        });

        it('should create like if it does not exist', async () => {
            const mockQuery = {
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            };
            mockLikeModel.findOne.mockReturnValue(mockQuery);
            mockLikeModel.create.mockResolvedValue(dto);
            mockPostService.getAuthorInfo.mockResolvedValue({
                authorId: 'author1',
                caption: 'Post Title',
            });

            const result = await service.like(dto);

            expect(mockLikeModel.create).toHaveBeenCalledWith(dto);
            expect(mockPostService.getAuthorInfo).toHaveBeenCalledWith(dto.targetId);
            expect(kafkaService.emit).toHaveBeenCalled();
            expect(result.data).toBe(true);
            expect(result.message).toContain('Liked');
        });

        it('should handle notification errors gracefully', async () => {
            const mockQuery = {
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            };
            mockLikeModel.findOne.mockReturnValue(mockQuery);
            mockLikeModel.create.mockResolvedValue(dto);
            mockPostService.getAuthorInfo.mockRejectedValue(new Error('Service down'));

            const result = await service.like(dto);

            expect(mockLikeModel.create).toHaveBeenCalledWith(dto);
            // Should still succeed even if notification fails
            expect(result.data).toBe(true);
        });
    });
});

