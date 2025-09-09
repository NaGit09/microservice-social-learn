"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressSchemaZ = void 0;
const zod_1 = require("zod");
exports.AddressSchemaZ = zod_1.z.object({
    country: zod_1.z.string(),
    province: zod_1.z.string(),
    district: zod_1.z.string(),
});
//# sourceMappingURL=address.zod.js.map