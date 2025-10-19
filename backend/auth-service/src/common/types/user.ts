import { File } from "../entities/file";
import { User } from "../entities/user";

export class UserInfo {
    id: string;
    username: string;
    fullname: string;
    avatar : File;
    constructor(user: User) {
      this.id = user._id.toString();
      this.username = user.username;
      this.fullname = user.fullname;
      this.avatar = user.avatar;
    }
  
  }