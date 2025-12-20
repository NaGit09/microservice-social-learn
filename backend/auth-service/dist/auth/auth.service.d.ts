import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import type { RegisterDto } from '../common/dto/account/register';
import type { LoginDto } from '../common/dto/account/login';
import { ApiResponse } from '../common/types/api.res';
import { AccountDocument } from 'src/common/entities/account';
import { UserService } from 'src/user/user.service';
import { TokenReq } from 'src/common/dto/account/token';
import { AccountLogin } from 'src/common/types/account';
import { RedisService } from 'src/redis/config.redis';
import type { ForgotPasswordDto, ResetPasswordDto } from '../common/dto/auth/forgot-password.dto';
export declare class AuthService {
    private readonly user;
    private authModel;
    private jwtService;
    private redis;
    private readonly logger;
    constructor(user: UserService, authModel: Model<AccountDocument>, jwtService: JwtService, redis: RedisService);
    register(dto: RegisterDto): Promise<ApiResponse<boolean>>;
    check(id: string): Promise<boolean>;
    login(dto: LoginDto): Promise<ApiResponse<AccountLogin>>;
    refreshToken(tokenReq: TokenReq): Promise<ApiResponse<string>>;
    logout(accessToken: string): Promise<ApiResponse<boolean>>;
    forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse<boolean>>;
    verifyOtpAndResetPassword(dto: ResetPasswordDto): Promise<ApiResponse<boolean>>;
}
