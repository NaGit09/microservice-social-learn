"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const zod_1 = require("zod");
exports.CreateUserDto = zod_1.z.object({
    username: zod_1.z.string().min(8, 'Username phải có ít nhất 8 ký tự'),
    userId: zod_1.z.string('UserId không được null'),
});
//# sourceMappingURL=createa-user.dto.js.map