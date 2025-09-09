"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvatarDto = void 0;
const zod_1 = require("zod");
const avatar_zod_1 = require("../zod/avatar.zod");
exports.UpdateAvatarDto = zod_1.z.object({
    userId: zod_1.z.string(),
    avatar: avatar_zod_1.AvatarSchemaZ,
});
//# sourceMappingURL=update-avatar.dto.js.map