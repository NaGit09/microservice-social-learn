import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../upload/service/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './entities/upload.entity';
import { v4 as uuidv4 } from 'uuid';
import { UploadDto } from './dto/response/upload.response';
import { mapperDtoToEntity, mapperUploadToDto } from './utils/mapper';
import { KafkaService } from './kafka/config.kafka';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly BUCKET = 'files';

  constructor(
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
    private readonly clientKafka: KafkaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * Upload a single file to Supabase and save metadata into MongoDB
   */
  async upload(file: Express.Multer.File, userId: string): Promise<UploadDto> {
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
        throw new HttpException(
          `Failed to upload file ${file.originalname} to Supabase`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const { data: urlData } = this.supabaseService.supabase.storage
        .from(this.BUCKET)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new HttpException(
          `Failed to generate public URL for file ${file.originalname}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const saveUpload = mapperDtoToEntity(
        file,
        userId,
        urlData.publicUrl,
        fileName,
      );
      const uploaded = new this.uploadModel(saveUpload);
      await uploaded.save();
      return mapperUploadToDto(uploaded.id as string, uploaded);
    } catch (err) {
      this.logger.error(
        `Upload error: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
      );
      throw new HttpException(
        'An unexpected error occurred during file upload.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<UploadDto[]> {
    const results: UploadDto[] = [];

    for (const file of files) {
      const saved = await this.upload(file, userId);
      results.push(saved);
    }
    return results;
  }

  /**
   * Delete files both from Supabase and MongoDB
   */
  async delete(action: string, ids: string[]): Promise<{ message: string }> {
    const files = await this.uploadModel.find({ _id: { $in: ids } });

    if (!files.length) {
      throw new HttpException(
        'No files found or not owned by user',
        HttpStatus.NOT_FOUND,
      );
    }

    const storedNames = files.map((f) => f.storedName);

    const { error } = await this.supabaseService.supabase.storage
      .from(this.BUCKET)
      .remove(storedNames);

    if (error) {
      this.logger.error(`Supabase delete error: ${error.message}`);
      throw new HttpException(
        'Failed to delete files from Supabase',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.uploadModel.deleteMany({ _id: { $in: ids } });

    return { message: 'Deleted files successfully' };
  }
}
