"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAuthHeaderAsBearerToken = void 0;
const fromAuthHeaderAsBearerToken = (req) => {
    const authorizationHeader = req.get('authorization');
    if (typeof authorizationHeader !== 'string') {
        return null;
    }
    const [scheme, token] = authorizationHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }
    return token;
};
exports.fromAuthHeaderAsBearerToken = fromAuthHeaderAsBearerToken;
//# sourceMappingURL=utils.js.map