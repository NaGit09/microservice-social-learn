"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDto = void 0;
const zod_1 = require("zod");
const profile_zod_1 = require("../zod/profile.zod");
exports.UpdateProfileDto = zod_1.z.object({
    userId: zod_1.z.string(),
    profile: profile_zod_1.ProfileSchemaZ,
});
//# sourceMappingURL=update-profile.dto.js.map