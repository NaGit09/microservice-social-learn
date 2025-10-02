import { ProfileDto } from '../dto/response/profile.resp';
import { Profile } from '../schema/profile.schema';

export const mapperProfileToDto = (profile: Profile): ProfileDto => {
  return {
    _id: profile._id,
    school: profile.school,
    major: profile.major,
    class: profile.class,
    year: profile.year,
    references: profile.references,
    hometown: profile.hometown,
  };
};
