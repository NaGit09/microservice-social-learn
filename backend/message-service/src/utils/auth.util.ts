import type { Request } from 'express';
export const fromAuthHeaderAsBearerToken = (
  req: Request,
): string | undefined => {
  const authorizationHeader = req.get('authorization');
  if (typeof authorizationHeader !== 'string') {
    return undefined;
  }
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return undefined;
  }
  return token;
};
