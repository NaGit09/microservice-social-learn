import { z } from 'zod';

export const participantsQuerySchema = z.preprocess((val) => {
    if (typeof val === 'string') {
        return val.split(',').map((item) => item.trim());
    }
    return val;
}, z.array(z.string().min(1)));