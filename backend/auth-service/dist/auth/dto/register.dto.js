"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.email(),
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(8),
});
//# sourceMappingURL=register.dto.js.map