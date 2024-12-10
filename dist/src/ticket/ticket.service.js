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
var TicketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const prisma_service_1 = require("../prisma.service");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const index_1 = require("../../constants/index");
const agency_service_1 = require("../agency/agency.service");
const client_1 = require("@prisma/client");
const actions_1 = require("../../constants/actions");
const ApiException_1 = require("../../helpers/ApiException");
const dayjs = require("dayjs");
const auth_service_1 = require("../auth/auth.service");
const AWS = require("aws-sdk");
const messenger_service_1 = require("../messenger/messenger.service");
const config_1 = require("@nestjs/config");
let TicketService = TicketService_1 = class TicketService {
    prismaService;
    dbLoggerService;
    agencyService;
    authService;
    messengerService;
    configService;
    logger = new common_1.Logger(TicketService_1.name);
    s3;
    constructor(prismaService, dbLoggerService, agencyService, authService, messengerService, configService) {
        this.prismaService = prismaService;
        this.dbLoggerService = dbLoggerService;
        this.agencyService = agencyService;
        this.authService = authService;
        this.messengerService = messengerService;
        this.configService = configService;
    }
    onModuleInit() {
        this.s3 = new AWS.S3({
            accessKeyId: this.configService.get('S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('S3_SECRET_KEY'),
        });
    }
    async createTicket(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if traveler exists');
            const traveler = await this.prismaService.traveler.findFirst({
                where: {
                    id: data.travelerId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!traveler) {
                this.logger.warn('traveler does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.travelerNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            for (const ticket of data.tickets) {
                const ticketData = {
                    arrival_city: ticket.arrivalCity,
                    arrival_time: dayjs(ticket.arrivalTime).toDate(),
                    traveler: {
                        connect: {
                            id: data.travelerId,
                        },
                    },
                    departure_city: ticket.departureCity,
                    departure_time: dayjs(ticket.departureTime).toDate(),
                    flight_number: ticket.flightNumber,
                    ticket_reference: ticket.ticketReference,
                    return_date: ticket.returnDate
                        ? dayjs(ticket.returnDate).toDate()
                        : undefined,
                    agency: {
                        connect: {
                            slug: data.agencySlug,
                        },
                    },
                };
                this.logger.log('Creating ticket');
                await this.prismaService.ticket.create({
                    data: ticketData,
                });
                this.logger.log('Logging ticket creation');
                await this.dbLoggerService.log({
                    action: actions_1.actions.tickets.created,
                    body: JSON.stringify(data),
                    description: `Ticket created for traveler ${data.travelerId}`,
                    metadata,
                    user_id: metadata.user,
                });
            }
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async updateTicket(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if traveler exists');
            const traveler = await this.prismaService.traveler.findFirst({
                where: {
                    id: data.travelerId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!traveler) {
                this.logger.warn('Traveler does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.travelerNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            for (const ticket of data.tickets) {
                const ticketData = {
                    arrival_city: ticket.arrivalCity,
                    arrival_time: dayjs(ticket.arrivalTime).toDate(),
                    departure_city: ticket.departureCity,
                    departure_time: dayjs(ticket.departureTime).toDate(),
                    flight_number: ticket.flightNumber,
                    return_date: ticket.returnDate
                        ? dayjs(ticket.returnDate).toDate()
                        : undefined,
                    traveler: {
                        connect: {
                            id: data.travelerId,
                        },
                    },
                };
                this.logger.log('Updating ticket');
                await this.prismaService.ticket.update({
                    where: {
                        id: ticket.ticketId,
                    },
                    data: ticketData,
                });
                this.logger.log('Logging ticket update');
                await this.dbLoggerService.log({
                    action: actions_1.actions.tickets.updated,
                    body: JSON.stringify(data),
                    description: `Ticket updated for traveler ${data.travelerId}`,
                    metadata,
                    user_id: metadata.user,
                });
            }
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async removeTicket(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            if (data.moveToRecycleBin === data.restoreFromRecycleBin) {
                this.logger.warn('Invalid operation');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.invalidOperation, common_1.HttpStatus.BAD_REQUEST));
            }
            this.logger.log('Getting ticket');
            const ticket = await this.prismaService.ticket.findUnique({
                where: {
                    id: data.ticketId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!ticket) {
                this.logger.warn('Ticket does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.ticketNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            if (!ticket.is_deleted && data.restoreFromRecycleBin) {
                this.logger.warn('Ticket is not in the recycle bin');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.ticketNotInRecycleBin, common_1.HttpStatus.NOT_FOUND));
            }
            if (ticket.is_deleted && data.moveToRecycleBin) {
                this.logger.warn('Ticket is already in the recycle bin');
                throw new common_1.BadRequestException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.ticketInRecycleBin, common_1.HttpStatus.BAD_REQUEST));
            }
            if (ticket.is_deleted && data.restoreFromRecycleBin) {
                await this.prismaService.ticket.update({
                    where: {
                        id: data.ticketId,
                    },
                    data: {
                        is_deleted: false,
                    },
                });
            }
            if (!ticket.is_deleted && data.moveToRecycleBin) {
                await this.prismaService.ticket.update({
                    where: {
                        id: data.ticketId,
                    },
                    data: {
                        is_deleted: true,
                    },
                });
            }
            this.logger.log('Logging ticket removal');
            await this.dbLoggerService.log({
                action: actions_1.actions.tickets.deleted,
                body: JSON.stringify(data),
                description: `Ticket  with id ${data.ticketId} has been ${data.moveToRecycleBin ? `Moved to ` : 'Restored from'} Recycle bin`,
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async listTickets(filters, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(filters.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, filters.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            const { page, size } = filters;
            const skip = (page - 1) * size;
            const where = {
                traveler: {
                    id: !JSON.parse(filters.travelerId) ? undefined : +filters.travelerId,
                    agency: {
                        slug: filters.agencySlug,
                    },
                    phone: filters.travelerPhone
                        ? { contains: filters.travelerPhone }
                        : undefined,
                    whatsapp_number: filters.whatsappNumber
                        ? { contains: filters.whatsappNumber }
                        : undefined,
                },
                is_deleted: filters.isDeleted === 'true'
                    ? true
                    : filters.isDeleted === 'false'
                        ? false
                        : undefined,
                created_at: {
                    gte: !filters.startDate
                        ? undefined
                        : dayjs(filters.startDate).toDate(),
                    lte: !filters.endDate
                        ? undefined
                        : dayjs(filters.endDate).endOf('day').toDate(),
                },
                departure_time: !filters.departureDate
                    ? undefined
                    : dayjs(filters.departureDate).toDate(),
            };
            this.logger.log('Getting tickets');
            const tickets = await this.prismaService.ticket.findMany({
                where,
                take: size,
                skip,
                orderBy: {
                    id: 'desc',
                },
                include: {
                    ticket_media: true,
                    traveler: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            image_url: true,
                            phone: true,
                            whatsapp_number: true,
                        },
                    },
                },
            });
            const totalCount = await this.prismaService.ticket.count({
                where,
            });
            return ApiResponse_1.ApiResponse.success({
                data: tickets,
                totalCount,
                totalPages: Math.ceil(totalCount / size),
                page,
                size,
            });
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async deleteTicket(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin]);
            this.logger.log('Checking if code is valid');
            await this.authService.verifyToken({ id: metadata.user }, data.code, false, client_1.otp_reoson.delete_ticket);
            this.logger.log('Getting ticket');
            const ticket = await this.prismaService.ticket.findUnique({
                where: {
                    id: data.ticketId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!ticket) {
                this.logger.warn('Ticket does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.ticketNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Deleting ticket');
            await this.prismaService.ticket.delete({
                where: {
                    id: data.ticketId,
                },
            });
            this.logger.log('Logging ticket deletion');
            await this.dbLoggerService.log({
                action: actions_1.actions.tickets.deleted,
                body: JSON.stringify(data),
                description: `Ticket with id ${data.ticketId} has been permanently deleted`,
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async uploadTicketMedia(file, data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            console.log(data);
            this.logger.log('Checking if ticket exists');
            const ticket = await this.prismaService.ticket.findFirst({
                where: {
                    id: +data.ticketId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
                include: {
                    ticket_media: true,
                    traveler: true,
                    agency: true,
                },
            });
            if (!ticket) {
                this.logger.warn('Ticket does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.ticketNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            if (ticket?.ticket_media?.media_url) {
                this.logger.log('Deleting existing media');
                await this.prismaService.ticket_media.deleteMany({
                    where: {
                        ticket_id: +data.ticketId,
                    },
                });
                await this.s3DeleteKey(ticket.ticket_media.key);
            }
            this.logger.log('Uploading media');
            const s3Response = await this.s3Upload(file.buffer, this.keyNameGenerator({ ticket }), file.mimetype);
            this.logger.log('Logging media upload');
            await this.dbLoggerService.log({
                action: actions_1.actions.tickets.updated,
                body: JSON.stringify(data),
                description: `Media uploaded for ticket ${data.ticketId}`,
                metadata,
                user_id: metadata.user,
            });
            await this.prismaService.ticket_media.create({
                data: {
                    ticket: {
                        connect: {
                            id: +data.ticketId,
                        },
                    },
                    key: s3Response.Key,
                    media_url: 'https://d3hae587xffvqe.cloudfront.net/' + s3Response.Key,
                },
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            console.log('ERROR: ', error);
            this.logger.error('ERROR: ' + error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async s3Upload(file, name, mimetype) {
        try {
            const params = {
                Bucket: this.configService.get('BUCKET_NAME'),
                Key: name,
                Body: file,
                ContentType: mimetype,
                ContentDisposition: 'inline',
            };
            let s3Response = await this.s3.upload(params).promise();
            return s3Response;
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async s3DeleteKey(key) {
        try {
            const params = {
                Bucket: this.configService.get('BUCKET_NAME'),
                Key: key,
            };
            let s3Response = await this.s3.deleteObject(params).promise();
            return s3Response;
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async messageTicket(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if ticket exists');
            const ticket = await this.prismaService.ticket.findUnique({
                where: {
                    id: +data.ticketId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
                include: {
                    ticket_media: true,
                    agency: true,
                    traveler: true,
                },
            });
            if (!ticket || ticket.is_deleted) {
                this.logger.warn('Ticket does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.ticketNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Sending message');
            const { agency, traveler } = ticket;
            await this.messengerService.sendWATicketNotification({
                phoneNumberId: this.configService.get('PHONE_NUMBER_ID'),
                authToken: this.configService.get('AUTH_TOKEN'),
                agencyName: agency.name,
                agencyPhoneNumber: agency.phone,
                agencyWhatsappNumber: agency.phone,
                arrival: ticket.arrival_city,
                departure: ticket.departure_city,
                flightNumber: ticket.flight_number,
                date: dayjs(ticket.departure_time).format('DD MMM YYYY'),
                mediaUrl: ticket.ticket_media.media_url,
                seatNumber: 'N/A',
                time: dayjs(ticket.departure_time).format('HH:mm'),
                travelerName: `${traveler.first_name} ${traveler.last_name}`,
                travelerWhatsappNumber: traveler.whatsapp_number,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    keyNameGenerator({ ticket }) {
        return `${ticket.agency.slug}/tickets/travelerPhone-${ticket.traveler.phone}-ticketId-000${ticket.id}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}`;
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = TicketService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.DBLoggerService,
        agency_service_1.AgencyService,
        auth_service_1.AuthService,
        messenger_service_1.MessengerService,
        config_1.ConfigService])
], TicketService);
//# sourceMappingURL=ticket.service.js.map