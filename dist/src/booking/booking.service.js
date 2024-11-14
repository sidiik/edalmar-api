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
var BookingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const prisma_service_1 = require("../prisma.service");
const booking_dto_1 = require("./booking.dto");
const ApiException_1 = require("../../helpers/ApiException");
const agency_service_1 = require("../agency/agency.service");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const constants_1 = require("../../constants");
const actions_1 = require("../../constants/actions");
const client_1 = require("@prisma/client");
const dayjs = require("dayjs");
let BookingService = BookingService_1 = class BookingService {
    prismaService;
    dbLogger;
    agencyService;
    logger = new common_1.Logger(BookingService_1.name);
    constructor(prismaService, dbLogger, agencyService) {
        this.prismaService = prismaService;
        this.dbLogger = dbLogger;
        this.agencyService = agencyService;
    }
    async createBooking(data, metadata) {
        try {
            this.logger.log('Checking if agency is disabled');
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if the user is linked to an agency');
            const { agent } = await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if traveler exists via id');
            const traveler = await this.prismaService.traveler.findUnique({
                where: {
                    id: data.travelerId,
                },
            });
            if (!traveler) {
                this.logger.warn('Traveler does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, constants_1.travelerErrors.travelerNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Creating a new booking');
            const booking = await this.prismaService.booking.create({
                data: {
                    agency: {
                        connect: {
                            slug: data.agencySlug,
                        },
                    },
                    traveler: {
                        connect: {
                            id: data.travelerId,
                        },
                    },
                    booking_description: data.bookingDescription,
                    agent: {
                        connect: {
                            id: agent.id,
                        },
                    },
                },
            });
            this.logger.log('Booking created successfully');
            this.dbLogger.log({
                action: actions_1.actions.booking.created,
                body: JSON.stringify(data),
                description: `Booking created for traveler ${traveler.first_name} ${traveler.last_name}`,
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(booking);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async updateBooking(data, metadata) {
        try {
            this.logger.log('Checking if agency is disabled');
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if traveler exists via id');
            const traveler = await this.prismaService.traveler.findUnique({
                where: {
                    id: data.travelerId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!traveler) {
                this.logger.warn('Traveler does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, constants_1.travelerErrors.travelerNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Checking if booking exists via id');
            const booking = await this.prismaService.booking.findUnique({
                where: {
                    id: data.bookingId,
                },
            });
            if (!booking) {
                this.logger.warn('Booking does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, constants_1.travelerErrors.bookingNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Updating the booking');
            const updatedBooking = await this.prismaService.booking.update({
                where: {
                    id: data.bookingId,
                },
                data: {
                    booking_description: data.bookingDescription,
                    booking_status: data.bookingStatus,
                    traveler: {
                        connect: {
                            id: data.travelerId,
                        },
                    },
                },
            });
            this.logger.log('Booking updated successfully');
            this.dbLogger.log({
                action: actions_1.actions.booking.updated,
                body: JSON.stringify(data),
                description: `Booking updated for traveler ${traveler.first_name} ${traveler.last_name}`,
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(updatedBooking);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async listBookings(filters, metadata) {
        try {
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, filters.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            const { page, size } = filters;
            const skip = (page - 1) * size;
            const whereClause = {
                traveler: {
                    id: !filters.travelerId ? undefined : +filters.travelerId,
                    phone: !filters.travelerPhone
                        ? undefined
                        : {
                            contains: filters.travelerPhone,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    whatsapp_number: !filters.whatsappPhoneNumber
                        ? undefined
                        : {
                            contains: filters.whatsappPhoneNumber,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                },
                created_at: {
                    gte: !filters.startDate
                        ? undefined
                        : dayjs(filters.startDate).toDate(),
                    lte: !filters.endDate
                        ? undefined
                        : dayjs(filters.endDate).endOf('day').toDate(),
                },
                agency: {
                    slug: filters.agencySlug,
                },
            };
            const bookings = await this.prismaService.booking.findMany({
                skip,
                take: size,
                where: whereClause,
                orderBy: {
                    created_at: 'desc',
                },
                include: {
                    traveler: filters.include === booking_dto_1.IncludeBooking.traveler ||
                        filters.include === booking_dto_1.IncludeBooking.all
                        ? true
                        : false,
                    tickets: filters.include === booking_dto_1.IncludeBooking.tickets ||
                        filters.include === booking_dto_1.IncludeBooking.all
                        ? true
                        : false,
                    _count: {
                        select: {
                            tickets: true,
                        },
                    },
                },
            });
            const totalCount = await this.prismaService.booking.count({
                where: whereClause,
            });
            return new ApiResponse_1.ApiResponse({
                data: bookings,
                totalCount,
                totalPages: Math.ceil(totalCount / size),
                page,
                size,
            });
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async getBooking(filters, metadata) {
        try {
            this.logger.log('Checking if agency is disabled');
            await this.agencyService.checkAgencyDisabled(filters.agencySlug);
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, filters.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if booking exists via id');
            const booking = await this.prismaService.booking.findUnique({
                where: {
                    id: +filters.bookingId,
                    agency: {
                        slug: filters.agencySlug,
                    },
                },
                include: {
                    traveler: true,
                    tickets: {
                        orderBy: {
                            id: 'desc',
                        },
                        include: {
                            ticket_media: true,
                        },
                    },
                    agent: {
                        select: {
                            id: true,
                            agent_status: true,
                            user: {
                                select: {
                                    id: true,
                                    firstname: true,
                                    lastname: true,
                                    phone_number: true,
                                    whatsapp_number: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!booking) {
                this.logger.warn('Booking does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, constants_1.travelerErrors.bookingNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            return ApiResponse_1.ApiResponse.success(booking);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = BookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.DBLoggerService,
        agency_service_1.AgencyService])
], BookingService);
//# sourceMappingURL=booking.service.js.map