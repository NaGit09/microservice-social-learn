import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../upload/service/supabase.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './entities/upload.entity';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from './types/api-resp';
import { UploadResp } from './types/upload-resp';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly BUCKET = 'files';
  private readonly DAY_DRAFT_EXPRIED = 30;
  constructor(
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async upload(
    file: Express.Multer.File,
    userId: string,
  ): Promise<ApiResponse<UploadResp>> {
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

      const uploaded = new this.uploadModel({
        storedName: fileName,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        userId: userId,
        url: urlData,
        isDraft: false,
      });
      await uploaded.save();
      const uploadResp = new UploadResp(uploaded);
      return {
        statusCode: 200,
        message: 'Upload file successfully !',
        data: uploadResp,
      };
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

  async uploadMultiple(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<ApiResponse<UploadResp[]>> {
    const results: UploadResp[] = [];

    for (const file of files) {
      const saved = (await this.upload(file, userId)).data;
      if (!saved)
        throw new HttpException(
          'Upload multifile failed',
          HttpStatus.BAD_REQUEST,
        );
      results.push(saved);
    }
    return {
      statusCode: 200,
      message: 'Upload multifile successfully',
      data: results,
    };
  }

  async delete(ids: string[]): Promise<ApiResponse<boolean>> {
    if (!ids || ids.length === 0) {
      this.logger.log('Delete command received no IDs.');
      throw new HttpException(
        'Delete command received no IDs.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let filesToDelete: UploadDocument[];
    try {
      filesToDelete = await this.uploadModel
        .find({
          _id: { $in: ids },
        })
        .exec();

      if (filesToDelete.length === 0) {
        this.logger.warn(
          `No files found in DB for deletion with IDs: [${ids.join(', ')}]`,
        );
      }
    } catch (dbError) {
      this.logger.error(
        `Failed to find files for deletion: ${dbError.message}`,
      );
      throw dbError;
    }

    const storedNames = filesToDelete.map((file) => file.storedName);
    const databaseIds = filesToDelete.map((file) => file._id);

    try {
      const { error: supabaseError } =
        await this.supabaseService.supabase.storage
          .from(this.BUCKET)
          .remove(storedNames);

      if (supabaseError) {
        this.logger.error(
          `Supabase deletion error: ${supabaseError.message}. Proceeding to delete from DB.`,
        );
      } else {
        this.logger.log(
          `Successfully deleted ${storedNames.length} files from Supabase.`,
        );
      }
    } catch (storageError) {
      this.logger.error(
        `Exception during Supabase deletion: ${storageError.message}. Proceeding to delete from DB.`,
      );
    }

    try {
      await this.uploadModel.deleteMany({
        _id: { $in: databaseIds },
      });
      this.logger.log(
        `Successfully deleted ${databaseIds.length} records from MongoDB.`,
      );
    } catch (dbError) {
      this.logger.error(
        `Failed to delete records from MongoDB: ${dbError.message}`,
      );
      throw dbError;
    }
    return {
      statusCode: 200,
      message: 'Delete files successfully',
      data: true,
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'deleteOldDrafts' })
  async handleDeleteOldDrafts(): Promise<ApiResponse<boolean>> {
    this.logger.log('Running cron job: Deleting old draft files...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - this.DAY_DRAFT_EXPRIED);

    const oldDrafts = await this.uploadModel
      .find({
        isDraft: true,
        createdAt: { $lt: thirtyDaysAgo },
      })
      .exec();

    if (oldDrafts.length === 0) {
      this.logger.log('No old draft files to delete.');
      return {
        statusCode: 200,
        data: true,
        message: `Successfully deleted ${oldDrafts.length} old draft files and their DB records.`,
      };
    }

    this.logger.log(`Found ${oldDrafts.length} old draft files to delete.`);

    const storedNamesToDelete = oldDrafts.map((draft) => draft.storedName);
    const idsToDelete = oldDrafts.map((draft) => draft._id);

    try {
      const { error: supabaseError } =
        await this.supabaseService.supabase.storage
          .from(this.BUCKET)
          .remove(storedNamesToDelete);

      if (supabaseError) {
        this.logger.error(
          `Supabase deletion error: ${supabaseError.message}. Proceeding to delete from DB anyway.`,
        );
      }

      await this.uploadModel.deleteMany({
        _id: { $in: idsToDelete },
      });
    } catch (error) {
      this.logger.error(
        `An error occurred during old draft deletion: ${error.message}`,
      );
    }
    return {
      statusCode: 200,
      message: `Successfully deleted ${oldDrafts.length} old draft files and their DB records.`,
      data: true,
    };
  }

  async markAsPublished(uploadIds: string[]): Promise<void> {
    if (!uploadIds || uploadIds.length === 0) {
      this.logger.log('markAsPublished received no IDs to update.');
      return;
    }

    const idsString = uploadIds.join(', ');
    this.logger.log(
      `Attempting to mark ${uploadIds.length} uploads as published: [${idsString}]`,
    );

    try {
      const result = await this.uploadModel
        .updateMany(
          {
            _id: { $in: uploadIds },
            isDraft: true,
          },
          {
            $set: { isDraft: false },
          },
        )
        .exec();

      if (result.matchedCount === 0) {
        this.logger.warn(
          `No draft documents found matching the provided IDs: [${idsString}]`,
        );
        return;
      }
      if (result.modifiedCount === 0) {
        this.logger.warn(
          `Documents were matched but 0 were modified. They might already be published. IDs: [${idsString}]`,
        );
        return;
      }
      this.logger.log(
        `Successfully published ${result.modifiedCount} of ${result.matchedCount} matched uploads.`,
      );
      return;
    } catch (error) {
      this.logger.error(
        `Failed to mark uploads [${idsString}] as published: ${error.message}`,
      );
      throw error;
    }
  }
}
