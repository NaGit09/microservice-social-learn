import {
  Injectable,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        // Tăng max size lên 25MB để phù hợp tài liệu
        new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }),
        new FileTypeValidator({
          fileType: /(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i,
        }),
      ],
    });
  }
}
