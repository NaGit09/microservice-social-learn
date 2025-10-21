import { Comment } from '../entities/comment.entity';
import { Pagination } from './pagination-resp';

export class CommentResp {
  comment: Comment;
  likes: number;
  replies: number | 0;
  constructor(comment: Comment, likes: number, replies: number) {
    this.comment = comment;
    this.likes = likes;
    this.replies = replies;
  }
}
export class RootCommentResp {
  comments: CommentResp[];
  pagination: Pagination;

  constructor(comment: CommentResp[], pagination: Pagination) {
    this.comments = comment;
    this.pagination = pagination;
  }
}

export class CommentNotify {
  actorId: string;
  receiverId: string;
  entityId: string;
  entityTitle: string;
  constructor(comment: Comment ) {
    this.actorId = comment.userId;
    this.entityId = comment._id.toString();
    this.entityTitle = comment.content;
    this.receiverId = comment.postId;
  }
}