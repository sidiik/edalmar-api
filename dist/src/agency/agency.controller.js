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
exports.AgencyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../guards/jwt.guard");
const agency_dto_1 = require("./agency.dto");
const agency_service_1 = require("./agency.service");
const authorize_guard_1 = require("../../guards/authorize.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const client_1 = require("@prisma/client");
const user_dto_1 = require("../user/user.dto");
let AgencyController = class AgencyController {
    agencyService;
    constructor(agencyService) {
        this.agencyService = agencyService;
    }
    createAgency(data, req) {
        return this.agencyService.createAgency(data, req);
    }
    updateAgency(data, req) {
        return this.agencyService.updateAgency(data, req);
    }
    updateAgencyKeys(data, req) {
        return this.agencyService.upsertAgencyKeys(data, req.metadata);
    }
    linkAgent(data, req) {
        return this.agencyService.linkAgent(data, req);
    }
    listAgents(agencySlug, req) {
        return this.agencyService.getAgents(agencySlug, req.metadata);
    }
    modifyAgentStatus(data, req) {
        return this.agencyService.modifyAgentStatus(data, req.metadata);
    }
    resetAgentPassword(data, req) {
        return this.agencyService.resetAgentPassword(data, req.metadata);
    }
    listAgencies(filters) {
        return this.agencyService.getAgencies(filters);
    }
};
exports.AgencyController = AgencyController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agency_dto_1.ICreateAgency, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "createAgency", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agency_dto_1.IUpdateAgency, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "updateAgency", null);
__decorate([
    (0, common_1.Put)('update-keys'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agency_dto_1.IUpdateAgencyKeys, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "updateAgencyKeys", null);
__decorate([
    (0, common_1.Post)('link-agent'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agency_dto_1.ILinkAgent, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "linkAgent", null);
__decorate([
    (0, common_1.Get)('list-agents/:agencySlug'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Param)('agencySlug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "listAgents", null);
__decorate([
    (0, common_1.Put)('modify-agent-status'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.IModifyAgentStatus, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "modifyAgentStatus", null);
__decorate([
    (0, common_1.Post)('reset-agent-password'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('agent_manager', 'admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agency_dto_1.IResetAgentPassword, Object]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "resetAgentPassword", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agency_dto_1.IListAgencyFilters]),
    __metadata("design:returntype", void 0)
], AgencyController.prototype, "listAgencies", null);
exports.AgencyController = AgencyController = __decorate([
    (0, common_1.Controller)('agency'),
    __metadata("design:paramtypes", [agency_service_1.AgencyService])
], AgencyController);
//# sourceMappingURL=agency.controller.js.map