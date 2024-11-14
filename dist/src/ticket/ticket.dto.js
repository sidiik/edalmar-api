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
exports.IMessageTicket = exports.IUploadTicketMedia = exports.PermenantTicketDelete = exports.ITicketListFilters = exports.IRemoveTicket = exports.IUpdateTickets = exports.ICreateTicket = exports.IUpdateTicketItem = exports.ICreateTicketItem = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ICreateTicketItem {
    ticketReference;
    flightNumber;
    departureTime;
    arrivalTime;
    departureCity;
    arrivalCity;
    returnDate;
}
exports.ICreateTicketItem = ICreateTicketItem;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "ticketReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "flightNumber", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "departureTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "arrivalTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "departureCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "arrivalCity", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ICreateTicketItem.prototype, "returnDate", void 0);
class IUpdateTicketItem {
    ticketId;
    ticketReference;
    flightNumber;
    departureTime;
    arrivalTime;
    departureCity;
    arrivalCity;
    returnDate;
}
exports.IUpdateTicketItem = IUpdateTicketItem;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateTicketItem.prototype, "ticketId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "ticketReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "flightNumber", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "departureTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "arrivalTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "departureCity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "arrivalCity", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IUpdateTicketItem.prototype, "returnDate", void 0);
class ICreateTicket {
    tickets;
    agencySlug;
    bookingId;
}
exports.ICreateTicket = ICreateTicket;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ICreateTicketItem),
    __metadata("design:type", Array)
], ICreateTicket.prototype, "tickets", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ICreateTicket.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ICreateTicket.prototype, "bookingId", void 0);
class IUpdateTickets {
    tickets;
    agencySlug;
    bookingId;
}
exports.IUpdateTickets = IUpdateTickets;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IUpdateTicketItem),
    __metadata("design:type", Array)
], IUpdateTickets.prototype, "tickets", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUpdateTickets.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IUpdateTickets.prototype, "bookingId", void 0);
class IRemoveTicket {
    ticketId;
    moveToRecycleBin;
    restoreFromRecycleBin;
    agencySlug;
}
exports.IRemoveTicket = IRemoveTicket;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IRemoveTicket.prototype, "ticketId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IRemoveTicket.prototype, "moveToRecycleBin", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IRemoveTicket.prototype, "restoreFromRecycleBin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IRemoveTicket.prototype, "agencySlug", void 0);
class ITicketListFilters {
    agencySlug;
    bookingId;
    isDeleted;
    page = 1;
    size = 5;
}
exports.ITicketListFilters = ITicketListFilters;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ITicketListFilters.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ITicketListFilters.prototype, "bookingId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ITicketListFilters.prototype, "isDeleted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], ITicketListFilters.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(({ value }) => Math.max(1, parseInt(value))),
    __metadata("design:type", Number)
], ITicketListFilters.prototype, "size", void 0);
class PermenantTicketDelete {
    ticketId;
    agencySlug;
    code;
}
exports.PermenantTicketDelete = PermenantTicketDelete;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PermenantTicketDelete.prototype, "ticketId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PermenantTicketDelete.prototype, "agencySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PermenantTicketDelete.prototype, "code", void 0);
class IUploadTicketMedia {
    ticketId;
    agencySlug;
}
exports.IUploadTicketMedia = IUploadTicketMedia;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUploadTicketMedia.prototype, "ticketId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IUploadTicketMedia.prototype, "agencySlug", void 0);
class IMessageTicket {
    ticketId;
    agencySlug;
}
exports.IMessageTicket = IMessageTicket;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], IMessageTicket.prototype, "ticketId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IMessageTicket.prototype, "agencySlug", void 0);
//# sourceMappingURL=ticket.dto.js.map