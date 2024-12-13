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
var ApplicationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const agency_service_1 = require("../agency/agency.service");
const logger_service_1 = require("../logger/logger.service");
const prisma_service_1 = require("../prisma.service");
const application_dto_1 = require("./application.dto");
const client_1 = require("@prisma/client");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const index_1 = require("../../constants/index");
const actions_1 = require("../../constants/actions");
const ApiException_1 = require("../../helpers/ApiException");
const dayjs = require("dayjs");
let ApplicationService = ApplicationService_1 = class ApplicationService {
    prismaService;
    dbLoggerService;
    agencyService;
    logger = new common_1.Logger(ApplicationService_1.name);
    constructor(prismaService, dbLoggerService, agencyService) {
        this.prismaService = prismaService;
        this.dbLoggerService = dbLoggerService;
        this.agencyService = agencyService;
    }
    async createApplication(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to this agency');
            const { user, agent } = await this.agencyService.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
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
            this.logger.log('Checking if the application reference already exists');
            const applicationReference = await this.prismaService.application.findFirst({
                where: {
                    application_ref: data.applicationReference,
                },
            });
            if (applicationReference) {
                this.logger.warn('Application reference already exists');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.applicationErrors.applicationReferenceExists, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Creating application');
            const application = await this.prismaService.application.create({
                data: {
                    application_ref: data.applicationReference,
                    application_status: data.applicationStatus,
                    application_type: data.applicationType,
                    agent: {
                        connect: {
                            id: user.role === 'admin' ? user.id : agent.id,
                        },
                    },
                    metadata: data.metadata,
                    due: dayjs(data.notificationDue).toDate(),
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
                },
            });
            this.logger.log('Logging application creation');
            await this.dbLoggerService.log({
                action: actions_1.actions.booking.created,
                body: JSON.stringify(data),
                description: `Application created for traveler ${data.travelerId}`,
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(application);
        }
        catch (error) {
            console.log(error);
            this.logger.error('Error creating application', JSON.stringify(error));
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async updateApplication(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data.agencySlug);
            this.logger.log('Checking if agent is linked to this agency');
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
            const applicationExists = await this.prismaService.application.findFirst({
                where: {
                    id: data.applicationId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
            });
            if (!applicationExists) {
                this.logger.warn('Application does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.applicationErrors.applicationNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Checking if the application reference already exists');
            const applicationReference = await this.prismaService.application.findFirst({
                where: {
                    application_ref: data.applicationReference,
                    id: {
                        not: data.applicationId,
                    },
                },
            });
            if (applicationReference) {
                this.logger.warn('Application reference already exists');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.applicationErrors.applicationReferenceExists, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Updating application');
            const application = await this.prismaService.application.update({
                where: {
                    id: data.applicationId,
                },
                data: {
                    application_ref: data.applicationReference,
                    application_status: data.applicationStatus,
                    application_type: data.applicationType,
                    metadata: data.metadata,
                    due: dayjs(data.notificationDue).toDate(),
                    traveler: {
                        connect: {
                            id: data.travelerId,
                        },
                    },
                },
            });
            this.logger.log('Logging application update');
            await this.dbLoggerService.log({
                action: actions_1.actions.booking.updated,
                body: JSON.stringify(data),
                description: `Application updated for traveler ${data.travelerId}`,
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(application);
        }
        catch (error) {
            this.logger.error('Error updating the application', JSON.stringify(error));
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async listApplications(filters, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(filters?.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, filters?.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            const { page, size } = filters;
            const skip = (page - 1) * size;
            let due;
            if (filters?.priority === application_dto_1.ApplicationPriority.urgent) {
                due = {
                    gte: dayjs().toDate(),
                    lte: dayjs().add(3, 'day').toDate(),
                };
            }
            else if (filters?.priority === application_dto_1.ApplicationPriority.overdue) {
                due = {
                    lte: dayjs().toDate(),
                };
            }
            else if (filters?.priority === application_dto_1.ApplicationPriority.normal) {
                due = {
                    gte: dayjs().add(3, 'day').toDate(),
                    lte: dayjs().add(7, 'day').toDate(),
                };
            }
            else if (filters?.priority === application_dto_1.ApplicationPriority.low) {
                due = {
                    gte: dayjs().add(7, 'day').toDate(),
                };
            }
            else {
                due = undefined;
            }
            this.logger.log('Notification due checkup');
            this.logger.log(due);
            const where = {
                traveler: {
                    id: !+filters?.travelerId ? undefined : +filters?.travelerId,
                    agency: {
                        slug: filters?.agencySlug,
                    },
                    phone: filters?.travelerPhone
                        ? { contains: filters?.travelerPhone }
                        : undefined,
                    whatsapp_number: filters?.whatsappNumber
                        ? { contains: filters?.whatsappNumber }
                        : undefined,
                },
                created_at: {
                    gte: !filters?.startDate
                        ? undefined
                        : dayjs(filters?.startDate).toDate(),
                    lte: !filters?.endDate
                        ? undefined
                        : dayjs(filters?.endDate).endOf('day').toDate(),
                },
                agency: {
                    slug: filters.agencySlug,
                },
                application_status: filters?.applicationStatus !== application_dto_1.ApplicationStatus.all
                    ? filters?.applicationStatus
                    : undefined,
                application_type: filters?.applicationType !== application_dto_1.ApplicationType.all
                    ? filters?.applicationType
                    : undefined,
                due,
            };
            this.logger.log('Getting applications');
            const applications = await this.prismaService.application.findMany({
                where,
                take: size,
                skip,
                orderBy: {
                    id: 'desc',
                },
                include: {
                    traveler: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            phone: true,
                            whatsapp_number: true,
                        },
                    },
                },
            });
            const totalCount = await this.prismaService.application.count({
                where,
            });
            return ApiResponse_1.ApiResponse.success({
                data: applications,
                totalCount,
                totalPages: Math.ceil(totalCount / size),
                page,
                size,
            });
        }
        catch (error) {
            console.log(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async getApplicationDetails(data, metadata) {
        try {
            await this.agencyService.checkAgencyDisabled(data?.agencySlug);
            this.logger.log('Checking if agent is linked to agency');
            await this.agencyService.checkAgentLinked(metadata.user, data?.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor]);
            this.logger.log('Getting application details');
            const application = await this.prismaService.application.findFirst({
                where: {
                    id: +data.applicationId,
                    agency: {
                        slug: data.agencySlug,
                    },
                },
                include: {
                    agent: {
                        select: {
                            id: true,
                            role: true,
                            user: {
                                select: {
                                    id: true,
                                    phone_number: true,
                                    whatsapp_number: true,
                                    firstname: true,
                                    lastname: true,
                                },
                            },
                        },
                    },
                    traveler: true,
                },
            });
            if (!application) {
                this.logger.warn('Application does not exist');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.applicationErrors.applicationNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            return ApiResponse_1.ApiResponse.success(application);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = ApplicationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.DBLoggerService,
        agency_service_1.AgencyService])
], ApplicationService);
//# sourceMappingURL=application.service.js.map