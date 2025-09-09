"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInforDto = void 0;
const zod_1 = require("zod");
const user_zod_1 = require("../zod/user.zod");
exports.UpdateInforDto = zod_1.z.object({
    userId: zod_1.z.string(),
    user: user_zod_1.UserSchemaZ,
});
//# sourceMappingURL=update-infor.dto.js.map