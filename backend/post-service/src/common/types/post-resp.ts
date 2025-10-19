import { Post } from '../entities/post.entity';
import { Pagination } from './pagination-resp';

export class AuthorInforResp {
  authorId: string;
  caption: string;

  constructor(post: Post) {
    this.authorId = post.author;
    this.caption = post.caption;
  }
}

export class PostResp {
  post: Post;
  totalLike: number;
  totalComment: number;
  constructor(post: Post, totalLike: number, totalComment: number) {
    this.post = post;
    this.totalLike = totalLike;
    this.totalComment = totalComment;
  }
}
export class RootPostResp {
  post: PostResp[];
  pagination: Pagination;

  constructor(comment: PostResp[], pagination: Pagination) {
    this.post = comment;
    this.pagination = pagination;
  }
}
