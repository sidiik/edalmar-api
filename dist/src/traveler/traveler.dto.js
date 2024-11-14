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
exports.IGetTraveler = exports.IListTravelersFilters = exports.IUpdateTraveler = exports.ICreateTraveler = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ICreateTraveler {
    firstname;
    lastname;
    address;
    email;
    phone;
    whatsappNumber;
    dob;
    agencySlug;
    nationality;
    notificationsEnabled;
}
exports.ICreateTraveler = ICreateTraveler;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "firstname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTraveler.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ICreateTraveler.prototype, "notificationsEnabled", void 0);
class IUpdateTraveler {
    firstname;
    lastname;
    address;
    email;
    phone;
    whatsappNumber;
    dob;
    agencySlug;
    nationality;
    notificationsEnabled;
    travelerId;
}
exports.IUpdateTraveler = IUpdateTraveler;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "firstname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "dob", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTraveler.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IUpdateTraveler.prototype, "notificationsEnabled", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateTraveler.prototype, "travelerId", void 0);
class IListTravelersFilters {
    agencySlug;
    page = 1;
    size = 5;
    firstname;
    lastname;
    phoneNumber;
    whatsappNumber;
    startDate;
    endDate;
}
exports.IListTravelersFilters = IListTravelersFilters;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IListTravelersFilters.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IListTravelersFilters.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "firstname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IListTravelersFilters.prototype, "endDate", void 0);
class IGetTraveler {
    travelerId;
    agencySlug;
}
exports.IGetTraveler = IGetTraveler;
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], IGetTraveler.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IGetTraveler.prototype, "agencySlug", void 0);
//# sourceMappingURL=traveler.dto.js.map