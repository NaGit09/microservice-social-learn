import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as zod from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema?: zod.ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata) {
    if (!this.schema) return value;

    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new HttpException('data is not valid', HttpStatus.BAD_REQUEST);
    }
    return result.data;
  }
}
