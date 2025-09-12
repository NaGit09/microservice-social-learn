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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const avatar_schema_1 = require("./avatar.schema");
const address_schema_1 = require("./address.schema");
const profile_schema_1 = require("./profile.schema");
const defaultUrl = 'https://ysachocrphmykusczuke.supabase.co/storage/v1/object/sign/image/geatsIX.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGNhMDcxNC1kNWYwLTQ5NjctYWNhMi05NjU2ZDhhNDFhYjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS9nZWF0c0lYLmpwZWciLCJpYXQiOjE3NTcyMTgzMTUsImV4cCI6MTc4ODc1NDMxNX0.VbY5V_r_aRWxJ0z46kAnYl1IIr564ifoLEK_LVFEJuQ';
let User = class User {
    username;
    bio;
    address;
    profile;
    avatar;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ unique: true, required: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: address_schema_1.AddressSchema, default: {} }),
    __metadata("design:type", address_schema_1.Address)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: profile_schema_1.ProfileSchema, default: {} }),
    __metadata("design:type", profile_schema_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: avatar_schema_1.AvatarSchema,
        default: { avatarId: '1', url: defaultUrl, type: 'image' },
    }),
    __metadata("design:type", avatar_schema_1.Avatar)
], User.prototype, "avatar", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map