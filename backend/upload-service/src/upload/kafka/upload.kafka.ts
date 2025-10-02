import { Controller } from '@nestjs/common';
import { UploadService } from '../upload.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class UploadEvent {
  constructor(private uploadService: UploadService) {}

  @EventPattern('post-delete')
  async deletePost(ids: string[]) {
    return this.uploadService.delete('delete post file', ids);
  }

  @EventPattern('avatar-delete')
  async deleteAvatar(ids: string[]) {
    return this.uploadService.delete('delete post file', ids);
  }

  @EventPattern('comment-delete')
  async deleteComment(ids: string[]) {
    return this.uploadService.delete('delete comment file', ids);
  }
}
