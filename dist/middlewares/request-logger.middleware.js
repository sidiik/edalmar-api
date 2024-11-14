"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RequestLoggerMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const dayjs = require("dayjs");
let RequestLoggerMiddleware = RequestLoggerMiddleware_1 = class RequestLoggerMiddleware {
    logger = new common_1.Logger(RequestLoggerMiddleware_1.name);
    use(req, res, next) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now();
        res.on('finish', () => {
            const statusCode = res.statusCode;
            const contentLength = res.get('content-length');
            const responseTime = Date.now() - startTime;
            let logMethod = this.logger.log;
            if (statusCode >= 500) {
                logMethod = this.logger.error;
            }
            else if (statusCode >= 400) {
                logMethod = this.logger.warn;
            }
            logMethod.call(this.logger, JSON.stringify({
                timestamp: dayjs().format('DD-MM-YYYYTHH:mm:ss'),
                method,
                url: originalUrl,
                status: statusCode,
                responseTime: `${responseTime}ms`,
                contentLength: contentLength || 'N/A',
                userAgent,
                ip: ip,
                userId: req?.metadata?.user || 'N/A',
            }));
        });
        next();
    }
};
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
exports.RequestLoggerMiddleware = RequestLoggerMiddleware = RequestLoggerMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], RequestLoggerMiddleware);
//# sourceMappingURL=request-logger.middleware.js.map