"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBioDto = void 0;
const zod_1 = require("zod");
exports.UpdateBioDto = zod_1.z.object({
    userId: zod_1.z.string('UserId không được null'),
    bio: zod_1.z.string(),
});
//# sourceMappingURL=update-bio.dto.js.map