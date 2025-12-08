import { AuthService } from './auth.service';
import { type RegisterDto } from '../common/dto/account/register';
import { type LoginDto } from '../common/dto/account/login';
import { type TokenReq } from 'src/common/dto/account/token';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("../common/types/api.res").ApiResponse<boolean>>;
    login(dto: LoginDto): Promise<import("../common/types/api.res").ApiResponse<import("../common/types/account").AccountLogin>>;
    refresh(data: TokenReq): Promise<import("../common/types/api.res").ApiResponse<string>>;
    logout(authHeader: string): Promise<import("../common/types/api.res").ApiResponse<boolean>>;
}
