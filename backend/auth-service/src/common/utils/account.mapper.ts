import { Account } from 'src/common/entities/account.entity';
import { JwtPayload } from '../types/JwtPayload';
import { CreateUserDto } from 'src/common/dto/user/createa-user.req';

export const mapperUserToDto = (user: Account) : CreateUserDto => {
  return {
    username: user.username,
    id: user._id.toString(),
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
