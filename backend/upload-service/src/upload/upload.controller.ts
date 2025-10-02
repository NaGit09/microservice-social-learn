import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileValidationPipe } from './pipe/upload.pipe';
import { UploadDto } from './dto/response/upload.response';

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
  ): Promise<UploadDto> {
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
  ): Promise<UploadDto[]> {
    return this.uploadService.uploadMultiple(files, userId);
  }
}
