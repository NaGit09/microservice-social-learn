"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSchemaZ = void 0;
const zod_1 = require("zod");
exports.ProfileSchemaZ = zod_1.z.object({
    school: zod_1.z.string(),
    major: zod_1.z.string(),
    class: zod_1.z.string(),
    year: zod_1.z.number(),
    references: zod_1.z.array(zod_1.z.string()).default([]),
});
//# sourceMappingURL=profile.zod.js.map