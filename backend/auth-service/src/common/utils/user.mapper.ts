import { User } from "../entities/user.schema";
import { userInfo } from "../types/user.resp";

export const mapperUserToDto = (user: User): userInfo => {
  return {
    id: user._id,
    username: user.username,
    fullname: user.fullname,
    avatartUrl: user.avatar.url,
  };
};
