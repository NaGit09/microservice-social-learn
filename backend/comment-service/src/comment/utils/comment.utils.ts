import {
  CommentResponse,
  CommentResponseSchema,
} from '../dto/response/comment.resp';
import {
  DeleteCommentResponse,
  DeleteCommentResponseSchema,
} from '../dto/response/delete.resp';
import { Comment } from '../entities/comment.entity';

export function toCommentResponse(
  id: string,
  comment: Comment,
): CommentResponse {
  return CommentResponseSchema.parse({
    id: id,
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    tag: comment.tag,
    reply: comment.reply,
    isEdit: comment.isEdit,
    isRoot: comment.isRoot,
    file: comment.file,
  });
}
export function toDeleteCommentResponse(id: string): DeleteCommentResponse {
  return DeleteCommentResponseSchema.parse({
    message: 'Comment deleted successfully',
    deletedId: id,
  });
}
