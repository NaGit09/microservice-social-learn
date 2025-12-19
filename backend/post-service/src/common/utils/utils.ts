
import type { Request } from 'express';
export const fromAuthHeaderAsBearerToken = (req: Request): string | null => {
    const authorizationHeader = req.headers['authorization'];
    if (typeof authorizationHeader !== 'string') {
        return null;
    }
    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }
    return token;
};
