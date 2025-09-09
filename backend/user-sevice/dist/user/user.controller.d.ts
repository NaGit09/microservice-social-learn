import { UserService } from './user.service';
import { CreateUserDto } from './dto/createa-user.dto';
import { UpdateInforDto } from './dto/update-infor.dto';
import { UpdateBioDto } from './dto/update-bio.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateAddressDto } from './dto/update-addres.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(dto: CreateUserDto): Promise<import("./schema/user.schema").User>;
    updateInfor(dto: UpdateInforDto): Promise<import("./schema/user.schema").User>;
    updateBio(dto: UpdateBioDto): Promise<import("./schema/user.schema").User>;
    updateAvatar(dto: UpdateAvatarDto): Promise<import("./schema/user.schema").User>;
    updateAddress(dto: UpdateAddressDto): Promise<import("./schema/user.schema").User>;
    updateProfile(dto: UpdateProfileDto): Promise<import("./schema/user.schema").User>;
}
