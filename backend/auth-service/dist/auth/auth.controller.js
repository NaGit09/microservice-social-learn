"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const register_1 = require("../common/dto/account/register");
const login_1 = require("../common/dto/account/login");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const ZodValidationPipe_1 = require("../common/pipe/ZodValidationPipe");
const token_1 = require("../common/dto/account/token");
const redis_auth_guard_1 = require("../redis/redis-auth.guard");
const forgot_password_dto_1 = require("../common/dto/auth/forgot-password.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async refresh(data) {
        return this.authService.refreshToken(data);
    }
    async logout(authHeader) {
        const token = authHeader.split(' ')[1];
        return this.authService.logout(token);
        return this.authService.logout(token);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto);
    }
    async resetPassword(dto) {
        return this.authService.verifyOtpAndResetPassword(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UsePipes)(new ZodValidationPipe_1.ZodValidationPipe(register_1.RegisterSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(new ZodValidationPipe_1.ZodValidationPipe(login_1.LoginSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Patch)('refresh'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt-refresh')),
    (0, common_1.UsePipes)(new ZodValidationPipe_1.ZodValidationPipe(token_1.TokenReqSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Patch)('logout'),
    (0, common_1.UseGuards)(redis_auth_guard_1.RedisAuth),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.UsePipes)(new ZodValidationPipe_1.ZodValidationPipe(forgot_password_dto_1.ForgotPasswordSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.UsePipes)(new ZodValidationPipe_1.ZodValidationPipe(forgot_password_dto_1.ResetPasswordSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map