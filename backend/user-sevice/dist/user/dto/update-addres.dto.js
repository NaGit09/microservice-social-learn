"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressDto = void 0;
const zod_1 = require("zod");
const address_zod_1 = require("../zod/address.zod");
exports.UpdateAddressDto = zod_1.z.object({
    userId: zod_1.z.string(),
    address: address_zod_1.AddressSchemaZ,
});
//# sourceMappingURL=update-addres.dto.js.map