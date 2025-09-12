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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schema/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getInfor(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    async create(dto) {
        const user = new this.userModel({
            username: dto.username,
            _id: dto.userId,
        });
        console.log(user);
        return user.save();
    }
    async updateUser(userId, update) {
        const updatedUser = await this.userModel.findOneAndUpdate({ userId }, { $set: update }, { new: true });
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        return updatedUser;
    }
    async updateAvatar(dto) {
        return this.updateUser(dto.userId, { avatar: dto.avatar });
    }
    async updateProfile(dto) {
        return this.updateUser(dto.userId, { profile: dto.profile });
    }
    async updateBio(dto) {
        return this.updateUser(dto.userId, { bio: dto.bio });
    }
    async updateAddress(dto) {
        return this.updateUser(dto.userId, { address: dto.address });
    }
    async updateInfor(dto) {
        return this.updateUser(dto.userId, dto);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map