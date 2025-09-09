import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AccountDocument } from './entities/account.entity';
import { JwtPayload } from './types/JwtPayload';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private authModel;
    private jwtService;
    constructor(authModel: Model<AccountDocument>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        username: string;
        email: string;
        isActive: boolean;
        role: string;
        permissions: string[];
        refreshToken?: string;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    validateUser(dto: LoginDto): Promise<JwtPayload>;
    login(user: JwtPayload): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
