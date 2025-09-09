"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemaZ = void 0;
const zod_1 = require("zod");
const avatar_zod_1 = require("./avatar.zod");
const address_zod_1 = require("./address.zod");
const profile_zod_1 = require("./profile.zod");
exports.UserSchemaZ = zod_1.z.object({
    bio: zod_1.z.string().default(''),
    address: address_zod_1.AddressSchemaZ,
    profile: profile_zod_1.ProfileSchemaZ,
    avatar: avatar_zod_1.AvatarSchemaZ,
});
//# sourceMappingURL=user.zod.js.map