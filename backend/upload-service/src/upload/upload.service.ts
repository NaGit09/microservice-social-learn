import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../upload/service/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './entities/upload.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly BUCKET = 'files';

  constructor(
    private readonly supabaseService: SupabaseService,
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
  ) {}

  /**
   * Upload a single file to Supabase and save metadata into MongoDB
   */
  async upload(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadDocument> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      const { error } = await this.supabaseService.supabase.storage
        .from(this.BUCKET)
        .upload(fileName, file.buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) {
        this.logger.error(`Supabase upload error: ${error.message}`);
        throw new InternalServerErrorException(
          `Failed to upload file ${file.originalname} to Supabase`,
        );
      }

      const { data: urlData } = this.supabaseService.supabase.storage
        .from(this.BUCKET)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new InternalServerErrorException(
          `Failed to generate public URL for file ${file.originalname}`,
        );
      }

      const uploaded = new this.uploadModel({
        originalName: file.originalname,
        storedName: fileName,
        userId,
        size: file.size,
        type: file.mimetype,
        url: urlData.publicUrl,
      });

      return await uploaded.save();
    } catch (err) {
      this.logger.error(
        `Upload error: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
      );
      throw new InternalServerErrorException(
        'An unexpected error occurred during file upload.',
      );
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<UploadDocument[]> {
    const results: UploadDocument[] = [];

    for (const file of files) {
      const saved = await this.upload(file, userId);
      results.push(saved);
    }

    return results;
  }

  /**
   * Delete files both from Supabase and MongoDB
   */
  async delete(ids: string[]): Promise<{ message: string }> {
    const files = await this.uploadModel.find({ _id: { $in: ids } });

    if (!files.length) {
      throw new NotFoundException('No files found or not owned by user');
    }

    const storedNames = files.map((f) => f.storedName);

    const { error } = await this.supabaseService.supabase.storage
      .from(this.BUCKET)
      .remove(storedNames);

    if (error) {
      this.logger.error(`Supabase delete error: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to delete files from Supabase',
      );
    }

    await this.uploadModel.deleteMany({ _id: { $in: ids } });

    return { message: 'Deleted files successfully' };
  }
}
