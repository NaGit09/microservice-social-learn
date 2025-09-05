export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  permissions: string[];
}
