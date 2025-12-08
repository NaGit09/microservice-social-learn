"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const JwtPayload_1 = require("../common/types/JwtPayload");
const account_1 = require("../common/entities/account");
const user_service_1 = require("../user/user.service");
const account_2 = require("../common/types/account");
const config_redis_1 = require("../redis/config.redis");
const constants_1 = require("../common/constant/constants");
let AuthService = AuthService_1 = class AuthService {
    user;
    authModel;
    jwtService;
    redis;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(user, authModel, jwtService, redis) {
        this.user = user;
        this.authModel = authModel;
        this.jwtService = jwtService;
        this.redis = redis;
    }
    async validateUser(dto) {
        const { email, password } = dto;
        const account = await this.authModel
            .findOne({ email })
            .select('+password')
            .exec();
        if (!account) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        return { ...new JwtPayload_1.JwtPayload(account) };
    }
    async register(dto) {
        const { email, username, password, fullname } = dto;
        const existingUser = await this.authModel
            .findOne({ email, username })
            .exec();
        if (existingUser) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new this.authModel({
            email,
            username,
            fullname,
            password: hashedPassword,
        });
        await newUser.save();
        const userInfo = new account_2.AccountInfo(newUser);
        await this.user.createAccount(userInfo);
        return {
            statusCode: 200,
            data: true,
            message: 'Register account successfully !',
        };
    }
    async check(id) {
        const user = await this.authModel.findOne({ id: id }).exec();
        return !!user;
    }
    async login(user) {
        const cacheData = await this.redis.getData(`auth:session:${user.sub}`);
        if (cacheData) {
            return {
                statusCode: 200,
                data: cacheData,
                message: 'Login successfully (from cache)',
            };
        }
        const accessToken = this.jwtService.sign(user, {
            secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
            expiresIn: constants_1.ACCESS_TOKEN_EXP,
        });
        const refreshToken = this.jwtService.sign(user, {
            secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
            expiresIn: constants_1.REFRESH_TOKEN_EXP,
        });
        const updatedUser = await this.authModel
            .findByIdAndUpdate(user.sub, { $set: { refreshToken } }, { new: true })
            .exec();
        if (!updatedUser) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const userDto = new account_2.AccountLogin(updatedUser, accessToken, refreshToken);
        await this.redis.setData(`auth:session:${userDto.info.id}`, userDto, constants_1.REDIS_TTL);
        return {
            statusCode: 200,
            data: userDto,
            message: 'Login successfully',
        };
    }
    async refreshToken(tokenReq) {
        const { userId } = tokenReq;
        const user = await this.authModel.findById(userId).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = { ...new JwtPayload_1.JwtPayload(user) };
        const newAccessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
            expiresIn: constants_1.ACCESS_TOKEN_EXP,
        });
        const userDtoForRedis = new account_2.AccountLogin(user, newAccessToken, user.refreshToken || '');
        await this.redis.setData(`auth:session:${newAccessToken}`, userDtoForRedis, constants_1.REDIS_TTL);
        return {
            statusCode: 200,
            data: newAccessToken,
            message: 'Refresh access token successfully !',
        };
    }
    async logout(accessToken) {
        try {
            const decoded = this.jwtService.decode(accessToken);
            if (decoded && decoded.sub) {
                await this.authModel.updateOne({ _id: decoded.sub }, { $unset: { refreshToken: 1 } });
            }
            await this.redis.delData(`auth:session:${decoded.sub}`);
        }
        catch (error) {
            this.logger.error('Error parsing token during logout', error);
        }
        return {
            statusCode: 200,
            data: true,
            message: 'Logged out successfully',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(account_1.Account.name)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mongoose_2.Model,
        jwt_1.JwtService,
        config_redis_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map