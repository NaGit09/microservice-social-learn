export const fromAuthHeaderAsBearerToken = (req: any): string | null => {
  const headers = req.headers || {};
  const authorizationHeader =
    headers['authorization'] || headers['Authorization'];

  if (typeof authorizationHeader !== 'string') {
    return null;
  }
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token;
};
