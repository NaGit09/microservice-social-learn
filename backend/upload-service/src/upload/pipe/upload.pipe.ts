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
        new MaxFileSizeValidator({ maxSize: 45 * 1024 * 1024 }),
        new FileTypeValidator({
          fileType:
            /(image\/(jpg|jpeg|png|gif)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation|text\/plain)$/i,
        }),
      ],
    });
  }
}
