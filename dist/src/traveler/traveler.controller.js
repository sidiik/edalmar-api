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
exports.TravelerController = void 0;
const common_1 = require("@nestjs/common");
const traveler_service_1 = require("./traveler.service");
const jwt_guard_1 = require("../../guards/jwt.guard");
const authorize_guard_1 = require("../../guards/authorize.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const traveler_dto_1 = require("./traveler.dto");
const client_1 = require("@prisma/client");
let TravelerController = class TravelerController {
    travelerService;
    constructor(travelerService) {
        this.travelerService = travelerService;
    }
    async createTraveler(data, req) {
        return await this.travelerService.createTraveler(data, req.metadata);
    }
    async updateTraveler(data, req) {
        return await this.travelerService.updateTraveler(data, req.metadata);
    }
    async listTravelers(data, req) {
        return await this.travelerService.listTravelers(data, req.metadata);
    }
    async getTraveler(data, req) {
        return await this.travelerService.getTraveler(data, req.metadata);
    }
};
exports.TravelerController = TravelerController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [traveler_dto_1.ICreateTraveler, Object]),
    __metadata("design:returntype", Promise)
], TravelerController.prototype, "createTraveler", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [traveler_dto_1.IUpdateTraveler, Object]),
    __metadata("design:returntype", Promise)
], TravelerController.prototype, "updateTraveler", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [traveler_dto_1.IListTravelersFilters, Object]),
    __metadata("design:returntype", Promise)
], TravelerController.prototype, "listTravelers", null);
__decorate([
    (0, common_1.Get)('detail'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [traveler_dto_1.IGetTraveler, Object]),
    __metadata("design:returntype", Promise)
], TravelerController.prototype, "getTraveler", null);
exports.TravelerController = TravelerController = __decorate([
    (0, common_1.Controller)('traveler'),
    __metadata("design:paramtypes", [traveler_service_1.TravelerService])
], TravelerController);
//# sourceMappingURL=traveler.controller.js.map