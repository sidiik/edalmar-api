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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logger/logger.service");
const prisma_service_1 = require("../prisma.service");
const ApiException_1 = require("../../helpers/ApiException");
const index_1 = require("../../constants/index");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const argon2 = require("argon2");
const actions_1 = require("../../constants/actions");
const client_1 = require("@prisma/client");
const cache_manager_1 = require("@nestjs/cache-manager");
let UserService = UserService_1 = class UserService {
    prismaService;
    dbLoggerService;
    cacheManager;
    logger = new common_1.Logger(UserService_1.name);
    constructor(prismaService, dbLoggerService, cacheManager) {
        this.prismaService = prismaService;
        this.dbLoggerService = dbLoggerService;
        this.cacheManager = cacheManager;
    }
    async getAllUsers(filters) {
        try {
            const { page, size } = filters;
            const skip = (page - 1) * size;
            this.logger.log('Fetching all users');
            const whereClause = {
                email: !filters.email
                    ? undefined
                    : {
                        contains: filters.email,
                    },
                is_suspended: filters.isSuspended === 'true'
                    ? true
                    : filters.isSuspended === 'false'
                        ? false
                        : undefined,
                phone_number: !filters.phone
                    ? undefined
                    : {
                        contains: filters.phone,
                    },
                whatsapp_number: !filters.whatsappNumber
                    ? undefined
                    : {
                        contains: filters.whatsappNumber,
                    },
                role: !filters.role ? undefined : filters.role,
                agent: !filters.agency_slug
                    ? undefined
                    : {
                        some: {
                            agency: {
                                slug: filters.agency_slug,
                            },
                        },
                    },
            };
            const users = await this.prismaService.user.findMany({
                where: whereClause,
                skip,
                take: size,
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    first_login: true,
                    profile_url: true,
                    phone_number: true,
                    whatsapp_number: true,
                    role: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            const totalCount = await this.prismaService.user.count({
                where: whereClause,
            });
            return new ApiResponse_1.ApiResponse({
                data: users,
                page,
                size,
                totalCount,
            });
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async createUser(data, metadata) {
        try {
            this.logger.log('Check if user exists');
            const emailTaken = await this.prismaService.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            const phoneTaken = await this.prismaService.user.findUnique({
                where: {
                    phone_number: data.phoneNumber,
                },
            });
            const whatsappTaken = await this.prismaService.user.findUnique({
                where: {
                    whatsapp_number: data.whatsappNumber,
                },
            });
            if (whatsappTaken || phoneTaken || emailTaken) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.userErrors.userExists, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Creating user');
            await this.prismaService.user.create({
                data: {
                    email: data.email,
                    password: await argon2.hash(data.password),
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone_number: data.phoneNumber,
                    whatsapp_number: data.whatsappNumber,
                    address: data.address,
                    is_2fa_enabled: data.is2faEnabled,
                },
            });
            const { password, ...rest } = data;
            this.logger.log('Store the activity log');
            await this.dbLoggerService.log({
                action: actions_1.actions.user.created,
                description: `User ${data.email} created`,
                body: JSON.stringify(rest),
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async updateUser(data, metadata) {
        try {
            this.logger.log('Check if user exists');
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: data.id,
                },
            });
            if (!user) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.userErrors.userNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Check if the email is already taken');
            const emailExists = await this.prismaService.user.findFirst({
                where: {
                    email: data.email,
                    id: {
                        not: data.id,
                    },
                },
            });
            if (emailExists) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.userErrors.emailExists, common_1.HttpStatus.CONFLICT));
            }
            this.logger.log('Updating user');
            const updatedUser = await this.prismaService.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    phone_number: data.phoneNumber,
                    whatsapp_number: data.whatsappNumber,
                    address: data.address,
                    is_2fa_enabled: data.is2faEnabled,
                    is_suspended: data.markAsSuspended,
                },
            });
            if (await this.cacheManager.get('USER-' + updatedUser.id)) {
                const { password, login_attempts, is_suspended, lock_until, ...rest } = updatedUser;
                await this.cacheManager.set('USER-' + updatedUser.id, rest);
            }
            this.logger.log('Store the activity log');
            await this.dbLoggerService.log({
                action: actions_1.actions.user.updated,
                description: `User ${data.email} updated`,
                body: JSON.stringify(data),
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async listMyLinkedAgencies(metadata) {
        try {
            const user = (await this.cacheManager.get('USER-' + metadata.user));
            const isAdmin = user.role === client_1.role.admin;
            const agencies = await this.prismaService.agency.findMany({
                where: {
                    agent: isAdmin
                        ? undefined
                        : {
                            some: {
                                user_id: metadata.user,
                            },
                        },
                },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    slug: true,
                    address: true,
                    logo_url: true,
                    agent: {
                        select: {
                            agent_status: true,
                            start_hour: true,
                            end_hour: true,
                            role: true,
                        },
                        where: {
                            user_id: metadata.user,
                        },
                    },
                },
            });
            return ApiResponse_1.ApiResponse.success({
                data: agencies,
            });
        }
        catch (error) {
            console.log(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async modifyUserStatus(data, metadata) {
        try {
            if (data.id === metadata.user) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.userErrors.cannotModifyOwnStatus, common_1.HttpStatus.CONFLICT));
            }
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: data.id,
                },
            });
            if (!user) {
                throw new common_1.ConflictException(ApiResponse_1.ApiResponse.failure(null, index_1.userErrors.userNotFound, common_1.HttpStatus.NOT_FOUND));
            }
            this.logger.log('Updating user status');
            const updatedUser = await this.prismaService.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    is_suspended: data.isSuspended,
                    is_2fa_enabled: data.is2faEnabled,
                    role: data.role,
                },
            });
            if (await this.cacheManager.get('USER-' + data.id)) {
                const { password, login_attempts, is_suspended, lock_until, ...rest } = updatedUser;
                await this.cacheManager.set('USER-' + data.id, rest);
            }
            this.logger.log('Store the activity log');
            await this.dbLoggerService.log({
                action: actions_1.actions.user.updated,
                description: `User ${data.id} updated`,
                body: JSON.stringify(data),
                metadata,
                user_id: metadata.user,
            });
            return ApiResponse_1.ApiResponse.success(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logger_service_1.DBLoggerService,
        cache_manager_1.Cache])
], UserService);
//# sourceMappingURL=user.service.js.map