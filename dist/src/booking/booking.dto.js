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
exports.IGetBooking = exports.ICreateTicket = exports.IBookingFilters = exports.IUpdateBooking = exports.ICreateBooking = exports.IncludeBooking = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var IncludeBooking;
(function (IncludeBooking) {
    IncludeBooking["traveler"] = "traveler";
    IncludeBooking["tickets"] = "tickets";
    IncludeBooking["all"] = "all";
})(IncludeBooking || (exports.IncludeBooking = IncludeBooking = {}));
class ICreateBooking {
    travelerId;
    agencySlug;
    bookingDescription;
}
exports.ICreateBooking = ICreateBooking;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ICreateBooking.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateBooking.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateBooking.prototype, "bookingDescription", void 0);
class IUpdateBooking {
    bookingId;
    travelerId;
    bookingStatus;
    agencySlug;
    bookingDescription;
}
exports.IUpdateBooking = IUpdateBooking;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateBooking.prototype, "bookingId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateBooking.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.booking_status),
    __metadata("design:type", String)
], IUpdateBooking.prototype, "bookingStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateBooking.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateBooking.prototype, "bookingDescription", void 0);
class IBookingFilters {
    page = 1;
    size = 5;
    travelerPhone;
    travelerId;
    include;
    whatsappPhoneNumber;
    agencySlug;
    startDate;
    endDate;
}
exports.IBookingFilters = IBookingFilters;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IBookingFilters.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], IBookingFilters.prototype, "size", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "travelerPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "travelerId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(IncludeBooking),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "include", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "whatsappPhoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IBookingFilters.prototype, "endDate", void 0);
class ICreateTicket {
    ticket_reference;
    booking_id;
    departureCity;
    arrivalCity;
    departureTime;
    arrivalTime;
    seatNumber;
    flightNumber;
    returnDate;
}
exports.ICreateTicket = ICreateTicket;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "ticket_reference", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ICreateTicket.prototype, "booking_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "departureCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "arrivalCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "departureTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "arrivalTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "seatNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "flightNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "returnDate", void 0);
class IGetBooking {
    bookingId;
    agencySlug;
}
exports.IGetBooking = IGetBooking;
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], IGetBooking.prototype, "bookingId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IGetBooking.prototype, "agencySlug", void 0);
//# sourceMappingURL=booking.dto.js.map