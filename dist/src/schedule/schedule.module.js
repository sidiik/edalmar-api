"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleMessageModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_service_1 = require("./schedule.service");
const messenger_module_1 = require("../messenger/messenger.module");
const messenger_service_1 = require("../messenger/messenger.service");
const prisma_service_1 = require("../prisma.service");
let ScheduleMessageModule = class ScheduleMessageModule {
};
exports.ScheduleMessageModule = ScheduleMessageModule;
exports.ScheduleMessageModule = ScheduleMessageModule = __decorate([
    (0, common_1.Module)({
        providers: [schedule_service_1.ScheduleService, messenger_service_1.MessengerService, prisma_service_1.PrismaService],
        imports: [messenger_module_1.MessengerModule],
    })
], ScheduleMessageModule);
//# sourceMappingURL=schedule.module.js.map