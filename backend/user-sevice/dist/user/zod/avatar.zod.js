"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarSchemaZ = void 0;
const zod_1 = require("zod");
exports.AvatarSchemaZ = zod_1.z.object({
    avatarId: zod_1.z.string(),
    url: zod_1.z.string().default(''),
    type: zod_1.z.string().default('image'),
});
//# sourceMappingURL=avatar.zod.js.map