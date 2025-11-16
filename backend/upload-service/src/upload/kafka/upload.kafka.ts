import { Controller } from '@nestjs/common';
import { UploadService } from '../upload.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Types } from 'mongoose';

@Controller()
export class UploadEvent {
  constructor(private uploadService: UploadService) {}


  @EventPattern('file-delete')
  async deletePost(@Payload() data: any) {
    const ids = data as string[];

    if (!Array.isArray(ids) || ids.length === 0) {
      console.warn('Received empty or invalid ids');
      return true; 
    }

    const validIds = ids.filter(id => Types.ObjectId.isValid(id));
    const invalidIds = ids.filter(id => !Types.ObjectId.isValid(id));

    if (invalidIds.length > 0) {
      console.warn(`Skipping invalid ObjectId(s): ${invalidIds.join(', ')}`);
    }

    if (validIds.length === 0) {
      return true; 
    }

    try {
      await this.uploadService.delete(validIds);
      return true;
    } catch (error) {
      console.error(`Error during file deletion: ${error.message}`);
      return true;
    }
  }

  @EventPattern('file-published')
  async handlePostPublished(@Payload() data: any) {
    const ids = data as string[];
    return this.uploadService.markAsPublished(ids);
  }
}
