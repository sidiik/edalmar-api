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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_dto_1 = require("./booking.dto");
const jwt_guard_1 = require("../../guards/jwt.guard");
const authorize_guard_1 = require("../../guards/authorize.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const client_1 = require("@prisma/client");
let BookingController = class BookingController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    createBooking(data, req) {
        return this.bookingService.createBooking(data, req.metadata);
    }
    updateBooking(data, req) {
        return this.bookingService.updateBooking(data, req.metadata);
    }
    listBookings(filters, req) {
        return this.bookingService.listBookings(filters, req.metadata);
    }
    getBookingDetails(filters, req) {
        return this.bookingService.getBooking(filters, req.metadata);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.ICreateBooking, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.IUpdateBooking, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.IBookingFilters, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "listBookings", null);
__decorate([
    (0, common_1.Get)('details'),
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard, authorize_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.role.admin, client_1.role.agent_user),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.IGetBooking, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBookingDetails", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map