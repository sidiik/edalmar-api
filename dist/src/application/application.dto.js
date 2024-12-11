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
exports.IListApplications = exports.IUpdateApplication = exports.ICreateApplication = exports.ApplicationStatus = exports.ApplicationType = exports.ApplicationPriority = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var ApplicationPriority;
(function (ApplicationPriority) {
    ApplicationPriority["all"] = "all";
    ApplicationPriority["overdue"] = "overdue";
    ApplicationPriority["urgent"] = "urgent";
    ApplicationPriority["normal"] = "normal";
    ApplicationPriority["low"] = "low";
})(ApplicationPriority || (exports.ApplicationPriority = ApplicationPriority = {}));
var ApplicationType;
(function (ApplicationType) {
    ApplicationType["all"] = "all";
    ApplicationType["visa"] = "visa";
    ApplicationType["passport"] = "passport";
    ApplicationType["certificate"] = "certificate";
})(ApplicationType || (exports.ApplicationType = ApplicationType = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["all"] = "all";
    ApplicationStatus["pending"] = "pending";
    ApplicationStatus["approved"] = "approved";
    ApplicationStatus["rejected"] = "rejected";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
class ICreateApplication {
    note;
    applicationReference;
    metadata;
    applicationType;
    applicationStatus;
    agencySlug;
    travelerId;
    notificationDue;
}
exports.ICreateApplication = ICreateApplication;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ICreateApplication.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateApplication.prototype, "applicationReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateApplication.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.application_type),
    __metadata("design:type", String)
], ICreateApplication.prototype, "applicationType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.application_status),
    __metadata("design:type", String)
], ICreateApplication.prototype, "applicationStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateApplication.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ICreateApplication.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ICreateApplication.prototype, "notificationDue", void 0);
class IUpdateApplication {
    applicationId;
    note;
    applicationReference;
    metadata;
    applicationType;
    applicationStatus;
    agencySlug;
    travelerId;
    notificationDue;
}
exports.IUpdateApplication = IUpdateApplication;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateApplication.prototype, "applicationId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "applicationReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.application_type),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "applicationType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.application_status),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "applicationStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateApplication.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IUpdateApplication.prototype, "notificationDue", void 0);
class IListApplications {
    agencySlug;
    travelerId;
    applicationStatus;
    travelerPhone;
    whatsappNumber;
    applicationType;
    page = 1;
    size = 5;
    startDate;
    endDate;
    priority;
}
exports.IListApplications = IListApplications;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IListApplications.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ApplicationStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "applicationStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "travelerPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ApplicationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "applicationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IListApplications.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IListApplications.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ApplicationPriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListApplications.prototype, "priority", void 0);
//# sourceMappingURL=application.dto.js.map