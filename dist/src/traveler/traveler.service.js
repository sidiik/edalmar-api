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
var TravelerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelerService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const prisma_service_1 = require("../prisma.service");
const agency_service_1 = require("../agency/agency.service");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const index_1 = require("../../constants/index");
const actions_1 = require("../../constants/actions");
const ApiException_1 = require("../../helpers/ApiException");
const client_1 = require("@prisma/client");
const dayjs = require("dayjs");
let TravelerService = TravelerService_1 = class TravelerService {
    prismaService;
    dbLogger;
    agencyService;
    logger = new common_1.Logger(TravelerService_1.name);
    constructor(prismaService, dbLogger, agencyService) {
        this.prismaService = prismaService;
        this.dbLogger = dbLogger;
        this.agencyService = agencyService;
    }
    async createTraveler(data, metadata) {
        try {
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log("Checking if agency is disabled or doesn't exist");
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if traveler exists via phone, email or whatsapp');
            const traveler = await this.prismaService.traveler.findFirst({
                where: {
                    AND: [
                        { phone: data.phone },
                        { email: data.email },
                        { whatsapp_number: data.whatsappNumber },
                        { agency: { slug: data.agencySlug } },
                    ],
                },
            });
            if (traveler) {
                this.logger.warn('Traveler already exists, skipping creation');
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.travelerExists, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Creating new traveler');
            const newTraveler = await this.prismaService.traveler.create({
                data: {
                    first_name: data.firstname,
                    last_name: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    whatsapp_number: data.whatsappNumber,
                    nationality: data.nationality,
                    agency: {
                        connect: {
                            slug: data.agencySlug,
                        },
                    },
                    notifications_enabled: data.notificationsEnabled,
                    address: data.address,
                    dob: dayjs(data.dob).toDate(),
                },
            });
            this.logger.log('Traveler created successfully');
            this.logger.log('Storing log in the database');
            await this.dbLogger.log({
                action: actions_1.actions.traveler.created,
                description: `Traveler ${newTraveler.first_name} ${newTraveler.last_name} created`,
                body: JSON.stringify(data),
                metadata: metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(newTraveler);
        }
        catch (error) {
            console.log(error);
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async updateTraveler(data, metadata) {
        try {
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log("Checking if agency is disabled or doesn't exist");
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
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
                this.logger.warn('Traveler not found');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.travelerNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log("Checking if traveler's phone number, email or whatsapp number is already linked to another user");
            const existingTraveler = await this.prismaService.traveler.findFirst({
                where: {
                    AND: [
                        { phone: data.phone },
                        { email: data.email },
                        { whatsapp_number: data.whatsappNumber },
                        {
                            agency: { slug: data.agencySlug },
                        },
                    ],
                    NOT: {
                        id: data.travelerId,
                    },
                },
            });
            if (existingTraveler) {
                this.logger.warn('Phone number, email or whatsapp number already linked to another traveler');
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.newTravelerContentExists, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Updating traveler');
            const updatedTraveler = await this.prismaService.traveler.update({
                where: {
                    id: data.travelerId,
                },
                data: {
                    first_name: data.firstname,
                    last_name: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    whatsapp_number: data.whatsappNumber,
                    address: data.address,
                    dob: dayjs(data.dob).toDate(),
                    notifications_enabled: data.notificationsEnabled,
                    nationality: data.nationality,
                },
            });
            this.logger.log('Traveler updated successfully');
            this.logger.log('Storing log in the database');
            await this.dbLogger.log({
                action: actions_1.actions.traveler.updated,
                description: `Traveler ${updatedTraveler.first_name} ${updatedTraveler.last_name} updated`,
                body: JSON.stringify(data),
                metadata: metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(updatedTraveler);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async getTraveler(data, metadata) {
        try {
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Checking if traveler exists');
            const traveler = await this.prismaService.traveler.findFirst({
                where: {
                    id: +data.travelerId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!traveler) {
                this.logger.warn('Traveler not found');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.travelerErrors.travelerNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Traveler found successfully');
            return ApiResponse_1.ApiResponse.success(traveler);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async listTravelers(filters, metadata) {
        try {
            this.logger.log("Checking if agency is disabled or doesn't exist");
            await this.agencyService.checkAgencyDisabled(filters.agencySlug);
            this.logger.log('Checking if the user is linked to an agency');
            await this.agencyService.checkAgentLinked(metadata.user, filters.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            const { page, size } = filters;
            const skip = (page - 1) * size;
            this.logger.log('Fetching travelers');
            const whereClause = {
                agency: !filters.agencySlug
                    ? undefined
                    : {
                        slug: filters.agencySlug,
                    },
                first_name: !filters.firstname
                    ? undefined
                    : {
                        contains: filters.firstname,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                last_name: !filters.lastname
                    ? undefined
                    : {
                        contains: filters.lastname,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                phone: !filters.phoneNumber
                    ? undefined
                    : {
                        contains: filters.phoneNumber,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                whatsapp_number: !filters.whatsappNumber
                    ? undefined
                    : {
                        contains: filters.whatsappNumber,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                created_at: {
                    gte: !filters.startDate
                        ? undefined
                        : dayjs(filters.startDate).toDate(),
                    lte: !filters.endDate
                        ? undefined
                        : dayjs(filters.endDate).endOf('day').toDate(),
                },
            };
            const travelers = await this.prismaService.traveler.findMany({
                where: whereClause,
                skip,
                take: size,
            });
            const totalCount = await this.prismaService.traveler.count({
                where: whereClause,
            });
            const totalPages = Math.ceil(totalCount / size);
            this.logger.log('Travelers fetched successfully');
            return ApiResponse_1.ApiResponse.success({
                data: travelers,
                totalCount,
                page,
                size,
                totalPages,
            });
        }
        catch (error) {
            console.log(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.TravelerService = TravelerService;
exports.TravelerService = TravelerService = TravelerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.DBLoggerService,
        agency_service_1.AgencyService])
], TravelerService);
//# sourceMappingURL=traveler.service.js.map