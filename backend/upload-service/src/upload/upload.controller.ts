import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileValidationPipe } from './pipe/upload.pipe';
import { UploadDocument } from './entities/upload.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload single file
   */
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body('userId') userId: string,
  ): Promise<UploadDocument> {
    return this.uploadService.upload(file, userId);
  }

  /**
   * Upload multiple files
   */
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(
    @UploadedFiles(FileValidationPipe) files: Express.Multer.File[],
    @Body('userId') userId: string,
  ): Promise<UploadDocument[]> {
    return this.uploadService.uploadMultiple(files, userId);
  }

  /**
   * Delete files
   */
  @Delete()
  async deleteFiles(@Body('ids') ids: string[]): Promise<{ message: string }> {
    return this.uploadService.delete(ids);
  }
}
