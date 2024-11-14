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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const common_1 = require("@nestjs/common");
const ticket_service_1 = require("./ticket.service");
const jwt_guard_1 = require("../../guards/jwt.guard");
const authorize_guard_1 = require("../../guards/authorize.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const client_1 = require("@prisma/client");
const ticket_dto_1 = require("./ticket.dto");
const platform_express_1 = require("@nestjs/platform-express");
let TicketController = class TicketController {
    ticketService;
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    async createTicket(data, req) {
        return this.ticketService.createTicket(data, req.metadata);
    }
    async updateTicket(data, req) {
        return this.ticketService.updateTicket(data, req.metadata);
    }
    async removeTicket(data, req) {
        return this.ticketService.removeTicket(data, req.metadata);
    }
    async listTickets(filters, req) {
        return this.ticketService.listTickets(filters, req.metadata);
    }
    async uploadTicketFile(file, data, req) {
        return this.ticketService.uploadTicketMedia(file, data, req.metadata);
    }
    async sendMessage(data, req) {
        return this.ticketService.messageTicket(data, req.metadata);
    }
};
exports.TicketController = TicketController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.ICreateTicket, Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.IUpdateTickets, Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Post)('remove'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.IRemoveTicket, Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "removeTicket", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.ITicketListFilters, Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "listTickets", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ticket_dto_1.IUploadTicketMedia, Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "uploadTicketFile", null);
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_dto_1.IMessageTicket, Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "sendMessage", null);
exports.TicketController = TicketController = __decorate([
    (0, common_1.Controller)('ticket'),
    __metadata("design:paramtypes", [ticket_service_1.TicketService])
], TicketController);
//# sourceMappingURL=ticket.controller.js.map