import { Profile } from "../entities/profile.schema";
import { ProfileDto } from "../types/profile.resp";

export const mapperProfileToDto = (profile: Profile): ProfileDto => {
  return {
    _id: profile._id,
    school: profile.school,
    major: profile.major,
    className: profile.className,
    year: profile.year,
    hobbies: profile.hobbies,
    hometown: profile.hometown,
  };
};
