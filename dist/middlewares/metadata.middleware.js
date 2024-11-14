"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpMiddleware = void 0;
const common_1 = require("@nestjs/common");
let IpMiddleware = class IpMiddleware {
    use(req, _, next) {
        const ip = req.headers['cf-connecting-ip'] ||
            req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            req.ip;
        const userAgent = req.headers['user-agent'];
        req.metadata = {
            userAgent,
            clientIp: ip,
            deviceId: req.cookies['device_id'],
        };
        next();
    }
};
exports.IpMiddleware = IpMiddleware;
exports.IpMiddleware = IpMiddleware = __decorate([
    (0, common_1.Injectable)()
], IpMiddleware);
//# sourceMappingURL=metadata.middleware.js.map