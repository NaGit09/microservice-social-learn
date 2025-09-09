import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import * as zod from 'zod';
export declare class ZodValidationPipe implements PipeTransform {
    private schema?;
    constructor(schema?: zod.ZodSchema | undefined);
    transform(value: unknown, _metadata: ArgumentMetadata): unknown;
}
