import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileValidationPipe } from './pipe/upload.pipe';
import { ApiResponse } from './types/api-resp';
import { UploadResp } from './types/upload-resp';

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
  ): Promise<ApiResponse<UploadResp>> {
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
  ): Promise<ApiResponse<UploadResp[]>>  {
    return this.uploadService.uploadMultiple(files, userId);
  }
  @Delete('/draft')
  async deleteDraftFile() {
    return this.uploadService.handleDeleteOldDrafts();
  }
}
