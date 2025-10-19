import { Profile } from "../entities/profile";

export class ProfileResp {
  id: string;
  school: string;
  major: string;
  className: string;
  year: number;
  hobbies: string[];
  hometown: string;

  constructor(profile: Profile) {
    this.id = profile._id.toString();
    this.major = profile.major;
    this.className = profile.className;
    this.year = profile.year;
    this.hobbies = profile.hobbies;
    this.hometown = profile.hometown;
  }

}