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
exports.IModifyAgentStatus = exports.IModifyUserStatus = exports.IUserFilters = exports.IUpdateUser = exports.ICreateUser = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ICreateUser {
    firstname;
    lastname;
    address;
    email;
    password;
    is2faEnabled;
    phoneNumber;
    whatsappNumber;
}
exports.ICreateUser = ICreateUser;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateUser.prototype, "firstname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateUser.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateUser.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ICreateUser.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateUser.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ICreateUser.prototype, "is2faEnabled", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], ICreateUser.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], ICreateUser.prototype, "whatsappNumber", void 0);
class IUpdateUser {
    firstname;
    lastname;
    address;
    email;
    phoneNumber;
    whatsappNumber;
    is2faEnabled;
    markAsSuspended;
    id;
}
exports.IUpdateUser = IUpdateUser;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateUser.prototype, "firstname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateUser.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateUser.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], IUpdateUser.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], IUpdateUser.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], IUpdateUser.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IUpdateUser.prototype, "is2faEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IUpdateUser.prototype, "markAsSuspended", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateUser.prototype, "id", void 0);
class IUserFilters {
    page = 1;
    size = 5;
    email;
    phone;
    whatsappNumber;
    agency_slug;
    role;
    isSuspended;
}
exports.IUserFilters = IUserFilters;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IUserFilters.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IUserFilters.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUserFilters.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUserFilters.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUserFilters.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUserFilters.prototype, "agency_slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUserFilters.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUserFilters.prototype, "isSuspended", void 0);
class IModifyUserStatus {
    id;
    is2faEnabled;
    isSuspended;
    role;
}
exports.IModifyUserStatus = IModifyUserStatus;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IModifyUserStatus.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IModifyUserStatus.prototype, "is2faEnabled", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IModifyUserStatus.prototype, "isSuspended", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.role),
    __metadata("design:type", String)
], IModifyUserStatus.prototype, "role", void 0);
class IModifyAgentStatus {
    email;
    agentStatus;
    agencySlug;
    role;
}
exports.IModifyAgentStatus = IModifyAgentStatus;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IModifyAgentStatus.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.agent_status),
    __metadata("design:type", String)
], IModifyAgentStatus.prototype, "agentStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IModifyAgentStatus.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.agent_role),
    __metadata("design:type", String)
], IModifyAgentStatus.prototype, "role", void 0);
//# sourceMappingURL=user.dto.js.map