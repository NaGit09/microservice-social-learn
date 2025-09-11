import { AuthService } from './auth.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("mongoose").Document<unknown, {}, import("./entities/account.entity").AccountDocument, {}, {}> & import("./entities/account.entity").Account & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(data: {
        userId: string;
    }): Promise<{
        access_token: string;
    }>;
    logout(data: {
        userId: string;
    }): Promise<{
        message: string;
    }>;
}
