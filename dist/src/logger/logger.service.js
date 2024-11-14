"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBLoggerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ApiException_1 = require("../../helpers/ApiException");
let DBLoggerService = class DBLoggerService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async log(data) {
        try {
            await this.prismaService.activity_log.create({
                data: {
                    user_id: data.user_id,
                    action: data.action,
                    description: data.description,
                    ip_addres: data.metadata.clientIp,
                    user_agent: data.metadata.userAgent,
                    body: data.body,
                },
            });
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.DBLoggerService = DBLoggerService;
exports.DBLoggerService = DBLoggerService = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DBLoggerService);
//# sourceMappingURL=logger.service.js.map