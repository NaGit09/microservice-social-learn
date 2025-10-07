import { UserInfo } from '../dto/response/user.res';
import { Account } from '../entities/account.entity';
import { JwtPayload } from '../types/JwtPayload';

export const mapperUserToDto = (userid: string, user: Account): UserInfo => {
  return {
    userId: userid,
    username: user.username,
    fullname: user.fullname,
  };
};
export const mapperUserToJwtPayload = (
  userid: string,
  user: Account,
): JwtPayload => {
  return {
    username: user.username,
    sub: userid,
    role: user.role,
    permissions: user.permissions,
    iss: 'nhutanh09',
  };
};
