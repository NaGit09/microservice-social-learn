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

