import { PipeTransform } from '@nestjs/common';
import { z } from 'zod';
export declare class ZodValidationPipe<T extends z.ZodTypeAny> implements PipeTransform {
    private schema;
    constructor(schema: T);
    transform(value: unknown): z.infer<T>;
}
