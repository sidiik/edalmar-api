"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const prisma_service_1 = require("../prisma.service");
const messenger_module_1 = require("../messenger/messenger.module");
const jwt_1 = require("@nestjs/jwt");
const index_1 = require("../../constants/index");
const logger_service_1 = require("../logger/logger.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, prisma_service_1.PrismaService, logger_service_1.DBLoggerService],
        exports: [auth_service_1.AuthService],
        imports: [
            messenger_module_1.MessengerModule,
            jwt_1.JwtModule.register({
                global: true,
                secret: index_1.jwtConstants.secret,
                signOptions: { expiresIn: '15m' },
            }),
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map