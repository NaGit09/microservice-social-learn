import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createa-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateBioDto } from './dto/update-bio.dto';
import { UpdateAddressDto } from './dto/update-addres.dto';
import { UpdateInforDto } from './dto/update-infor.dto';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getInfor(id: string): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    updateUser(userId: string, update: Record<string, any>): Promise<User>;
    updateAvatar(dto: UpdateAvatarDto): Promise<User>;
    updateProfile(dto: UpdateProfileDto): Promise<User>;
    updateBio(dto: UpdateBioDto): Promise<User>;
    updateAddress(dto: UpdateAddressDto): Promise<User>;
    updateInfor(dto: UpdateInforDto): Promise<User>;
}
