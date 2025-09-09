import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AccountDocument } from './entities/account.entity';
import { JwtPayload } from './types/JwtPayload';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { ClientKafka } from '@nestjs/microservices';
export declare class AuthService implements OnModuleInit {
    private readonly kafkaClient;
    private authModel;
    private jwtService;
    constructor(kafkaClient: ClientKafka, authModel: Model<AccountDocument>, jwtService: JwtService);
    onModuleInit(): Promise<void>;
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
