"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbLoggerModule = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
const logger_controller_1 = require("./logger.controller");
const prisma_service_1 = require("../prisma.service");
let DbLoggerModule = class DbLoggerModule {
};
exports.DbLoggerModule = DbLoggerModule;
exports.DbLoggerModule = DbLoggerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [logger_controller_1.LoggerController],
        providers: [logger_service_1.DBLoggerService, prisma_service_1.PrismaService],
    })
], DbLoggerModule);
//# sourceMappingURL=logger.module.js.map