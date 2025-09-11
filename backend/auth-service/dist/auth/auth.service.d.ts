import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './entities/account.entity';
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
    register(dto: RegisterDto): Promise<import("mongoose").Document<unknown, {}, AccountDocument, {}, {}> & Account & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
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
