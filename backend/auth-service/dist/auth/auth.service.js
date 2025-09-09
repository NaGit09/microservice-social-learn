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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const account_entity_1 = require("./entities/account.entity");
const microservices_1 = require("@nestjs/microservices");
let AuthService = class AuthService {
    kafkaClient;
    authModel;
    jwtService;
    constructor(kafkaClient, authModel, jwtService) {
        this.kafkaClient = kafkaClient;
        this.authModel = authModel;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
        await this.kafkaClient.connect();
    }
    async register(dto) {
        const { email, username, password } = dto;
        const existingUser = await this.authModel
            .findOne({ email: email, username: username })
            .exec();
        if (existingUser)
            throw new common_1.ConflictException('User already exists');
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new this.authModel({
            email,
            username,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        const { password: _, ...result } = savedUser.toObject();
        this.kafkaClient.emit('user.create', {
            username: result.username,
            userId: result.id,
        });
        return result;
    }
    async validateUser(dto) {
        const { email, password } = dto;
        const user = await this.authModel.findOne({ email: email }).exec();
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return {
            username: user.username,
            sub: String(user._id),
            role: user.role,
            permissions: user.permissions,
        };
    }
    async login(user) {
        const payload = {
            sub: user.sub,
            username: user.username,
            role: user.role,
            permissions: user.permissions,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
            expiresIn: '45m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET_KEY',
            expiresIn: '7d',
        });
        await this.authModel.updateOne({ _id: user.sub }, { $set: { refreshToken } });
        return { access_token: accessToken, refresh_token: refreshToken };
    }
    async refreshToken(userId) {
        const user = await this.authModel
            .findById(userId)
            .exec();
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const newAccessToken = this.jwtService.sign({ sub: String(user._id), username: user.username }, {
            secret: process.env.JWT_SECRET || 'ACCESS_SECRET_KEY',
            expiresIn: '45m',
        });
        return { access_token: newAccessToken };
    }
    async logout(userId) {
        await this.authModel.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KAFKA_SERVICE')),
    __param(1, (0, mongoose_1.InjectModel)(account_entity_1.Account.name)),
    __metadata("design:paramtypes", [microservices_1.ClientKafka,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map