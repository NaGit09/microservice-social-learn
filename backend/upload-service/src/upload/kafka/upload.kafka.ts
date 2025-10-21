import { Controller } from '@nestjs/common';
import { UploadService } from '../upload.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UploadEvent {
  constructor(private uploadService: UploadService) {}

  @EventPattern('file-delete')
  async deletePost(@Payload() data: any) {
    const ids = data as string[];
    return this.uploadService.delete(ids);
  }

  @EventPattern('file-published')
  async handlePostPublished(@Payload() data: any) {
    const ids = data as string[];
    return this.uploadService.markAsPublished(ids);
  }
}
