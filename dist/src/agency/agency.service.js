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
exports.AgencyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ApiException_1 = require("../../helpers/ApiException");
const slug_1 = require("../../helpers/slug");
const index_1 = require("../../constants/index");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const actions_1 = require("../../constants/actions");
const logger_service_1 = require("../logger/logger.service");
const client_1 = require("@prisma/client");
const cache_manager_1 = require("@nestjs/cache-manager");
const argon2 = require("argon2");
let AgencyService = class AgencyService {
    prismaService;
    dbLogger;
    cacheManager;
    logger = new common_1.Logger();
    constructor(prismaService, dbLogger, cacheManager) {
        this.prismaService = prismaService;
        this.dbLogger = dbLogger;
        this.cacheManager = cacheManager;
    }
    async getAgencies(filters) {
        try {
            const { page, size } = filters;
            const skip = (page - 1) * size;
            const whereClause = {
                name: !filters.name
                    ? undefined
                    : {
                        contains: filters.name,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                agency_disabled: filters.agency_disabled === 'true'
                    ? true
                    : filters.agency_disabled === 'false'
                        ? false
                        : undefined,
                phone: !filters.phone
                    ? undefined
                    : {
                        equals: filters.phone,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
            };
            const agencies = await this.prismaService.agency.findMany({
                skip,
                take: size,
                where: whereClause,
                orderBy: {
                    created_at: 'desc',
                },
            });
            const totalCount = await this.prismaService.agency.count({
                where: whereClause,
            });
            return new ApiResponse_1.ApiResponse({
                data: agencies,
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
    async createAgency(data, req) {
        try {
            const slug = (0, slug_1.genSlug)(data.agencyName);
            const checkAgency = await this.prismaService.agency.findFirst({
                where: {
                    slug,
                },
            });
            this.logger.log('Checking if agency exists');
            if (checkAgency) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyExists, common_1.HttpStatus.CONFLICT));
            }
            const agency = await this.prismaService.agency.create({
                data: {
                    name: data.agencyName,
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    slug,
                },
            });
            this.logger.log('Agency created ' + JSON.stringify(data));
            await this.dbLogger.log({
                action: actions_1.actions.agency.created,
                body: JSON.stringify(data),
                description: `Agency created ${data.agencyName}`,
                user_id: req.metadata.user,
                metadata: req.metadata,
            });
            return new ApiResponse_1.ApiResponse(agency);
        }
        catch (error) {
            this.logger.error(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async updateAgency(data, req) {
        try {
            this.logger.log('Updating agency ' + JSON.stringify(data));
            const { agencyId, ...rest } = data;
            const slug = (0, slug_1.genSlug)(rest.agencyName);
            const checkAgency = await this.prismaService.agency.findFirst({
                where: {
                    slug,
                    NOT: {
                        id: agencyId,
                    },
                },
            });
            this.logger.log('Checking if agency exists');
            if (checkAgency) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyExists, common_1.HttpStatus.CONFLICT));
            }
            const agency = await this.prismaService.agency.update({
                where: {
                    id: agencyId,
                },
                data: {
                    name: rest.agencyName,
                    address: rest.address,
                    phone: rest.phone,
                    email: rest.email,
                    max_agents: data.maxAgents,
                    slug,
                    agency_disabled: data.markAsDisabled,
                },
            });
            await this.dbLogger.log({
                action: actions_1.actions.agency.updated,
                body: JSON.stringify(data),
                description: `Agency updated ${rest.agencyName}`,
                user_id: req.metadata.user,
                metadata: req.metadata,
            });
            return new ApiResponse_1.ApiResponse(agency);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async linkAgent(data, req) {
        try {
            this.logger.log("Checking if total active agents is less than the agency's max agents");
            const totalActiveAgents = await this.prismaService.agent.count({
                where: {
                    agency: {
                        slug: data.agencySlug,
                    },
                    agent_status: 'active',
                },
            });
            this.logger.log('Check if user exists');
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agentNotFound, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Check if agency exists');
            const agency = await this.prismaService.agency.findFirst({
                where: {
                    slug: data.agencySlug,
                },
            });
            if (!agency) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyNotFound, common_1.HttpStatus.CONFLICT));
            }
            if (agency.agency_disabled) {
                throw new common_1.BadRequestException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyDisabled, common_1.HttpStatus.BAD_REQUEST));
            }
            if (totalActiveAgents >= agency.max_agents) {
                this.logger.error('Maximum number of agents reached');
                throw new common_1.BadRequestException(ApiResponse_1.ApiResponse.failure({
                    maxAgents: agency.max_agents,
                    totalActiveAgents,
                }, index_1.agencyErrors.maxAgentsReached, common_1.HttpStatus.BAD_REQUEST));
            }
            this.logger.log('Check if agent exists');
            const agent = await this.prismaService.agent.findFirst({
                where: {
                    user_id: user.id,
                    agency_id: agency.id,
                },
            });
            if (agent) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agentAlreadyLinked, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Linking agent to agency');
            await this.prismaService.agent.create({
                data: {
                    agent_status: data.agent_status,
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    agency: {
                        connect: {
                            slug: data.agencySlug,
                        },
                    },
                },
            });
            if (user.role !== client_1.role.admin) {
                this.logger.log('Updating user role to agent');
                await this.prismaService.user.update({
                    where: {
                        email: data.email,
                    },
                    data: {
                        role: 'agent_user',
                    },
                });
            }
            await this.dbLogger.log({
                action: actions_1.actions.agent.linked,
                body: JSON.stringify(data),
                description: `Agent linked to ${data.agencySlug}`,
                user_id: req.metadata.user,
                metadata: req.metadata,
            });
            return new ApiResponse_1.ApiResponse(null);
        }
        catch (error) {
            console.log(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async getAgents(slug, metadata) {
        try {
            await this.checkAgentLinked(metadata.user, slug, [client_1.agent_role.admin]);
            const agents = await this.prismaService.agent.findMany({
                where: {
                    agency: {
                        slug,
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstname: true,
                            lastname: true,
                            address: true,
                            email: true,
                            phone_number: true,
                            role: true,
                            is_2fa_enabled: true,
                            is_suspended: true,
                            profile_url: true,
                            whatsapp_number: true,
                        },
                    },
                },
            });
            return new ApiResponse_1.ApiResponse(agents);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async upsertAgencyKeys(data, metadata) {
        try {
            this.logger.log('Checking if agency exists');
            const agency = await this.prismaService.agency.findFirst({
                where: {
                    id: data.agencyId,
                },
            });
            if (!agency) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyNotFound, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Upserting agency keys');
            await this.prismaService.agency_keys.upsert({
                where: {
                    agency_id: data.agencyId,
                },
                update: {
                    twilio_sid: data.twilioSid,
                    twilio_auth_token: data.twilioAuthToken,
                    twilio_phone_number: data.twilioPhoneNumber,
                    whatsapp_auth_token: data.whatsappAuthToken,
                },
                create: {
                    twilio_sid: data.twilioSid,
                    twilio_auth_token: data.twilioAuthToken,
                    twilio_phone_number: data.twilioPhoneNumber,
                    whatsapp_auth_token: data.whatsappAuthToken,
                    agency_id: data.agencyId,
                },
            });
            this.logger.log('Storing the activity log');
            await this.dbLogger.log({
                action: actions_1.actions.agency.keysUpserted,
                body: JSON.stringify(data),
                description: `Agency keys upserted for ${agency.name}`,
                user_id: metadata.user,
                metadata,
            });
            this.logger.log('Agency keys upserted');
            return new ApiResponse_1.ApiResponse(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async checkAgentLinked(userId, agencySlug, requiredRoles, isCurrentUser = true, silent = false) {
        try {
            this.logger.log('Checking if agent is linked to agency');
            const user = isCurrentUser &&
                (await this.cacheManager.get('USER-' + userId));
            if (!user && isCurrentUser) {
                throw new common_1.UnauthorizedException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agentNotFound, common_1.HttpStatus.UNAUTHORIZED));
            }
            const agent = await this.prismaService.agent.findFirst({
                where: {
                    user_id: userId,
                    agency: {
                        slug: agencySlug,
                    },
                },
            });
            if (user.role === client_1.role.admin && isCurrentUser) {
                return { user, agent };
            }
            if (!agent) {
                this.logger.error("Agent isn't linked to the agency");
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            const hasRequiredRole = requiredRoles.includes(agent.role);
            if ((agent?.agent_status === 'inactive' || !hasRequiredRole) && !silent) {
                throw new common_1.ForbiddenException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agentInsufficientPermissions, common_1.HttpStatus.FORBIDDEN));
            }
            return { user, agent };
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async checkAgencyDisabled(agencySlug, silent = false) {
        const agency = await this.prismaService.agency.findFirst({
            where: {
                slug: agencySlug,
            },
        });
        if (!agency || (agency?.agency_disabled && !silent)) {
            throw new common_1.BadRequestException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agencyNotFound, common_1.HttpStatus.BAD_REQUEST));
        }
    }
    async resetAgentPassword(data, metadata) {
        try {
            this.logger.log('Checking if agent is linked to agency ' + data.agencySlug);
            await this.checkAgentLinked(metadata.user, data.agencySlug, [
                client_1.agent_role.admin,
            ]);
            const user = await this.prismaService.user.findFirst({
                where: {
                    email: data.email.toLowerCase(),
                },
            });
            if (!user) {
                this.logger.log("Agent doesn't exist");
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agentNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Check if the user is linked to the agency');
            await this.checkAgentLinked(user.id, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor, client_1.agent_role.user], false, true);
            this.logger.log('Resetting agent password');
            await this.prismaService.user.update({
                where: {
                    email: data.email.toLowerCase(),
                },
                data: {
                    password: await argon2.hash(data.newPassword),
                },
            });
            this.logger.log('Storing the activity log');
            await this.dbLogger.log({
                action: actions_1.actions.agent.passwordReset,
                body: JSON.stringify(data),
                description: `Agent password reset for ${data.email}`,
                user_id: metadata.user,
                metadata,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async modifyAgentStatus(data, metadata) {
        try {
            this.logger.log('Checking if agent is linked to agency');
            const agentManager = await this.checkAgentLinked(metadata.user, data.agencySlug, [client_1.agent_role.admin]);
            this.logger.log("Checking if agent is the current user's account");
            if (agentManager.user.email === data.email) {
                throw new common_1.BadRequestException(ApiResponse_1.ApiResponse.failure(null, index_1.userErrors.cannotModifyOwnStatus, common_1.HttpStatus.BAD_REQUEST));
            }
            this.logger.log('Checking if user exists');
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                this.logger.error('User not found');
                throw new common_1.NotFoundException(ApiResponse_1.ApiResponse.failure(null, index_1.agencyErrors.agentNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Checking if agent is linked to agency');
            const { agent } = await this.checkAgentLinked(user.id, data.agencySlug, [client_1.agent_role.admin, client_1.agent_role.editor, client_1.agent_role.user], false, true);
            this.logger.log('Modifying agent status');
            await this.prismaService.agent.update({
                where: {
                    id: agent.id,
                },
                data: {
                    agent_status: data.agentStatus,
                    role: data.role,
                },
            });
            this.logger.log('Storing the activity log');
            await this.dbLogger.log({
                action: actions_1.actions.agent.updated,
                body: JSON.stringify(data),
                description: `Agent status modified for ${data.email}`,
                user_id: metadata.user,
                metadata,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.AgencyService = AgencyService;
exports.AgencyService = AgencyService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.DBLoggerService,
        cache_manager_1.Cache])
], AgencyService);
//# sourceMappingURL=agency.service.js.map