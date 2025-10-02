import { userInfo } from '../dto/response/user.resp';
import { User } from '../schema/user.schema';

export const mapperUserToDto = (user: User): userInfo => {
  return {
    id: user._id,
    username: user.username,
    fullname: user.fullname,
    avatartUrl: user.avatar.url,
  };
};
