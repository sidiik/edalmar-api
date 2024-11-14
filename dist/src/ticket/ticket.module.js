"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModule = void 0;
const common_1 = require("@nestjs/common");
const ticket_service_1 = require("./ticket.service");
const ticket_controller_1 = require("./ticket.controller");
const prisma_service_1 = require("../prisma.service");
const logger_service_1 = require("../logger/logger.service");
const agency_module_1 = require("../agency/agency.module");
const booking_module_1 = require("../booking/booking.module");
const auth_module_1 = require("../auth/auth.module");
const messenger_module_1 = require("../messenger/messenger.module");
let TicketModule = class TicketModule {
};
exports.TicketModule = TicketModule;
exports.TicketModule = TicketModule = __decorate([
    (0, common_1.Module)({
        controllers: [ticket_controller_1.TicketController],
        providers: [ticket_service_1.TicketService, prisma_service_1.PrismaService, logger_service_1.DBLoggerService],
        imports: [agency_module_1.AgencyModule, booking_module_1.BookingModule, auth_module_1.AuthModule, messenger_module_1.MessengerModule],
    })
], TicketModule);
//# sourceMappingURL=ticket.module.js.map