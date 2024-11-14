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
exports.IResetAgentPassword = exports.ILinkAgent = exports.IListAgencyFilters = exports.IAddAgent = exports.IUpdateAgencyKeys = exports.IUpdateAgency = exports.ICreateAgency = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ICreateAgency {
    agencyName;
    address;
    phone;
    email;
}
exports.ICreateAgency = ICreateAgency;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateAgency.prototype, "agencyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateAgency.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateAgency.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateAgency.prototype, "email", void 0);
class IUpdateAgency {
    agencyName;
    address;
    maxAgents;
    phone;
    email;
    agencyId;
    markAsDisabled;
}
exports.IUpdateAgency = IUpdateAgency;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgency.prototype, "agencyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgency.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateAgency.prototype, "maxAgents", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgency.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgency.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateAgency.prototype, "agencyId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IUpdateAgency.prototype, "markAsDisabled", void 0);
class IUpdateAgencyKeys {
    twilioSid;
    twilioAuthToken;
    twilioPhoneNumber;
    whatsappAuthToken;
    agencyId;
}
exports.IUpdateAgencyKeys = IUpdateAgencyKeys;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgencyKeys.prototype, "twilioSid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgencyKeys.prototype, "twilioAuthToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgencyKeys.prototype, "twilioPhoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateAgencyKeys.prototype, "whatsappAuthToken", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateAgencyKeys.prototype, "agencyId", void 0);
class IAddAgent {
    status;
    user_id;
    agencySlug;
}
exports.IAddAgent = IAddAgent;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.agent_status),
    __metadata("design:type", String)
], IAddAgent.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IAddAgent.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IAddAgent.prototype, "agencySlug", void 0);
class IListAgencyFilters {
    name;
    agency_disabled;
    phone;
    page = 1;
    size = 5;
}
exports.IListAgencyFilters = IListAgencyFilters;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListAgencyFilters.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListAgencyFilters.prototype, "agency_disabled", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListAgencyFilters.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IListAgencyFilters.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IListAgencyFilters.prototype, "size", void 0);
class ILinkAgent {
    email;
    agencySlug;
    agent_status;
}
exports.ILinkAgent = ILinkAgent;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase()),
    __metadata("design:type", String)
], ILinkAgent.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ILinkAgent.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.agent_status),
    __metadata("design:type", String)
], ILinkAgent.prototype, "agent_status", void 0);
class IResetAgentPassword {
    email;
    newPassword;
    agencySlug;
}
exports.IResetAgentPassword = IResetAgentPassword;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IResetAgentPassword.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IResetAgentPassword.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IResetAgentPassword.prototype, "agencySlug", void 0);
//# sourceMappingURL=agency.dto.js.map