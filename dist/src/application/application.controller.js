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
exports.ApplicationController = void 0;
const common_1 = require("@nestjs/common");
const application_service_1 = require("./application.service");
const jwt_guard_1 = require("../../guards/jwt.guard");
const authorize_guard_1 = require("../../guards/authorize.guard");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const application_dto_1 = require("./application.dto");
let ApplicationController = class ApplicationController {
    applicationService;
    constructor(applicationService) {
        this.applicationService = applicationService;
    }
    async listApplications(data, req) {
        return this.applicationService.listApplications(data, req.metadata);
    }
    async createApplication(data, req) {
        return this.applicationService.createApplication(data, req.metadata);
    }
    async updateApplication(data, req) {
        return this.applicationService.updateApplication(data, req.metadata);
    }
};
exports.ApplicationController = ApplicationController;
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.IListApplications, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "listApplications", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.ICreateApplication, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "createApplication", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [application_dto_1.IUpdateApplication, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "updateApplication", null);
exports.ApplicationController = ApplicationController = __decorate([
    (0, common_1.Controller)('application'),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationController);
//# sourceMappingURL=application.controller.js.map