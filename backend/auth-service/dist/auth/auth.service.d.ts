import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { JwtPayload } from '../common/types/JwtPayload';
import type { RegisterDto } from '../common/dto/account/register';
import type { LoginDto } from '../common/dto/account/login';
import { ApiResponse } from '../common/types/api.res';
import { AccountDocument } from 'src/common/entities/account';
import { UserService } from 'src/user/user.service';
import { TokenReq } from 'src/common/dto/account/token';
import { AccountLogin } from 'src/common/types/account';
import { RedisService } from 'src/redis/config.redis';
export declare class AuthService {
    private readonly user;
    private authModel;
    private jwtService;
    private redis;
    private readonly logger;
    constructor(user: UserService, authModel: Model<AccountDocument>, jwtService: JwtService, redis: RedisService);
    validateUser(dto: LoginDto): Promise<JwtPayload>;
    register(dto: RegisterDto): Promise<ApiResponse<boolean>>;
    check(id: string): Promise<boolean>;
    login(user: JwtPayload): Promise<ApiResponse<AccountLogin>>;
    refreshToken(tokenReq: TokenReq): Promise<ApiResponse<string>>;
    logout(accessToken: string): Promise<ApiResponse<boolean>>;
}
