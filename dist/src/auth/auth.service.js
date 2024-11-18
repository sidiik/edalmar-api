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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ApiException_1 = require("../../helpers/ApiException");
const errors_1 = require("../../constants/errors");
const argon2 = require("argon2");
const dayjs = require("dayjs");
const ApiResponse_1 = require("../../helpers/ApiResponse");
const messenger_service_1 = require("../messenger/messenger.service");
const utils_1 = require("../../utils");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const cache_manager_1 = require("@nestjs/cache-manager");
const logger_service_1 = require("../logger/logger.service");
let AuthService = class AuthService {
    prismaService;
    messengerService;
    jwtService;
    dbLoggerService;
    cacheManager;
    constructor(prismaService, messengerService, jwtService, dbLoggerService, cacheManager) {
        this.prismaService = prismaService;
        this.messengerService = messengerService;
        this.jwtService = jwtService;
        this.dbLoggerService = dbLoggerService;
        this.cacheManager = cacheManager;
    }
    async requestOTP(data, metadata) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: metadata.user,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
            }
            if (user.is_suspended) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.accout_suspended);
            }
            await this.dbLoggerService.log({
                action: 'user.request_otp',
                description: 'User requested for OTP',
                body: JSON.stringify(data),
                metadata,
                user_id: metadata.user,
            });
            return this.sendOtpMessage({
                agencyName: '',
                authToken: process.env.AUTH_TOKEN,
                phoneNumberId: process.env.PHONE_NUMBER_ID,
                user,
                reason: data.reason,
            });
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async whoAmI(user_id) {
        try {
            const user = await this.cacheManager.get('USER-' + user_id.toString());
            if (user) {
                return user;
            }
            const { password, login_attempts, is_suspended, lock_until, ...rest } = await this.prismaService.user.findUnique({
                where: {
                    id: user_id,
                },
                include: {
                    agent: true,
                },
            });
            if (!rest) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
            }
            await this.cacheManager.set('USER-' + rest.id.toString(), rest);
            return rest;
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async signIn(data, res, metadata) {
        try {
            const { email, password } = data;
            const user = await this.prismaService.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
            }
            if (user.is_suspended) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.accout_suspended);
            }
            if (user.role === client_1.role.agent_user && data.agency_slug) {
                const agent = await this.prismaService.agent.findFirst({
                    where: {
                        agency: {
                            slug: data.agency_slug,
                        },
                        user: {
                            id: user.id,
                        },
                    },
                    include: {
                        agency: {
                            include: {
                                agency_keys: true,
                            },
                        },
                    },
                });
                if (!agent) {
                    throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
                }
                let login_attempts = user.login_attempts;
                if (user.lock_until && dayjs().isBefore(user.lock_until)) {
                    throw new common_1.UnauthorizedException(new ApiResponse_1.ApiResponse({
                        lock_until: user.lock_until,
                        login_attempts: user.login_attempts,
                    }, errors_1.authErrors.account_temporarily_disabled, common_1.HttpStatus.UNAUTHORIZED));
                }
                else {
                    if (user.lock_until) {
                        login_attempts = 0;
                    }
                }
                const is_password_valid = await argon2.verify(user.password, password);
                if (!is_password_valid) {
                    login_attempts = login_attempts + 1;
                    if (agent?.agency?.account_lock_enabled) {
                        await this.prismaService.user.update({
                            where: {
                                id: user.id,
                            },
                            data: {
                                login_attempts,
                                lock_until: login_attempts >= agent.agency.user_login_attempts
                                    ? dayjs()
                                        .add(agent.agency.user_lock_minutes, 'minute')
                                        .toDate()
                                    : null,
                            },
                        });
                    }
                    throw new common_1.UnauthorizedException(new ApiResponse_1.ApiResponse({
                        attempts_left: agent.agency.user_login_attempts - login_attempts,
                    }, errors_1.authErrors.invalidCredentials, common_1.HttpStatus.UNAUTHORIZED));
                }
                await this.resetLoginAttempts(user.email);
                if (user.is_2fa_enabled) {
                    return this.sendOtpMessage({
                        user,
                        agencyName: agent.agency.name,
                        authToken: process.env.AUTH_TOKEN,
                        phoneNumberId: process.env.PHONE_NUMBER_ID,
                    });
                }
                await this.prismaService.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        login_attempts: 0,
                        lock_until: null,
                    },
                });
                const { access_token, refresh_token } = await this.generateTokens(user);
                await this.storeTokensInCookie(res, access_token, refresh_token, user.id, metadata.userAgent, metadata.clientIp, metadata.deviceId);
                await this.dbLoggerService.log({
                    action: 'user.signin',
                    description: 'User signed in',
                    body: JSON.stringify({ ...data, password: '********' }),
                    metadata,
                    user_id: user.id,
                });
                return new ApiResponse_1.ApiResponse({
                    is2faEnabled: false,
                });
            }
            let login_attempts = user.login_attempts;
            if (user.lock_until && dayjs().isBefore(user.lock_until)) {
                throw new common_1.UnauthorizedException(new ApiResponse_1.ApiResponse({
                    lock_until: user.lock_until,
                    login_attempts: user.login_attempts,
                }, errors_1.authErrors.account_temporarily_disabled, common_1.HttpStatus.UNAUTHORIZED));
            }
            else {
                if (user.lock_until) {
                    login_attempts = 0;
                }
            }
            const is_password_valid = await argon2.verify(user.password, password);
            if (!is_password_valid) {
                login_attempts = login_attempts + 1;
                await this.prismaService.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        login_attempts,
                        lock_until: login_attempts >= 5 ? dayjs().add(10, 'minute').toDate() : null,
                    },
                });
                throw new common_1.UnauthorizedException(new ApiResponse_1.ApiResponse({
                    attempts_left: 5 - login_attempts,
                }, errors_1.authErrors.invalidCredentials, common_1.HttpStatus.UNAUTHORIZED));
            }
            await this.resetLoginAttempts(user.email);
            if (user.is_2fa_enabled) {
                return this.sendOtpMessage({
                    user,
                    agencyName: '',
                    phoneNumberId: process.env.PHONE_NUMBER_ID,
                    authToken: process.env.AUTH_TOKEN,
                });
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    login_attempts: 0,
                    lock_until: null,
                },
            });
            const { access_token, refresh_token } = await this.generateTokens(user);
            await this.storeTokensInCookie(res, access_token, refresh_token, user.id, metadata.userAgent, metadata.clientIp, metadata.deviceId);
            return new ApiResponse_1.ApiResponse({
                is2faEnabled: false,
            });
        }
        catch (error) {
            console.log(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async resetLoginAttempts(email) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
            }
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    login_attempts: 0,
                    lock_until: null,
                },
            });
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async generateTokens(user) {
        const { password, login_attempts, is_suspended, lock_until, ...rest } = user;
        await this.cacheManager.set('USER-' + user.id.toString(), rest);
        return {
            access_token: this.jwtService.sign({ subject: user.id }, { expiresIn: '15m' }),
            refresh_token: this.jwtService.sign({ subject: user.id, familyId: uuid_1.v4 }, { expiresIn: '1d' }),
        };
    }
    async sendOtpMessage({ user, phoneNumberId, authToken, reason, }) {
        try {
            const existingOtp = await this.verifyToken(user, undefined, true);
            if (existingOtp) {
                throw new common_1.BadRequestException(new ApiResponse_1.ApiResponse(null, errors_1.authErrors.otp_already_sent, common_1.HttpStatus.BAD_REQUEST));
            }
            const otp = (0, utils_1.otpGenerator)(6);
            await this.prismaService.otp.create({
                data: {
                    otp,
                    user_id: user.id,
                    expires_at: dayjs().add(5, 'minute').toDate(),
                    reason: reason || client_1.otp_reoson.sign_in,
                },
            });
            await this.messengerService.sendWAOTPMessage({
                authToken,
                code: otp,
                to: user.whatsapp_number,
                phoneNumberId,
            });
            return new ApiResponse_1.ApiResponse({ is2faEnabled: true, identity: user.id });
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async verifyToken(user, token, ignore, reason) {
        try {
            const otp = await this.prismaService.otp.findFirst({
                where: {
                    otp: token || undefined,
                    user_id: user?.id,
                    is_active: true,
                    reason: reason || client_1.otp_reoson.sign_in,
                    expires_at: {
                        gt: dayjs().toDate(),
                    },
                },
            });
            if (!otp && !ignore) {
                throw new common_1.BadRequestException(new ApiResponse_1.ApiResponse(null, errors_1.authErrors.otp_invalid, common_1.HttpStatus.BAD_REQUEST));
            }
            return otp;
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async getTokensThroughOtp(token, identity, res, metadata) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: identity,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.otp_invalid);
            }
            const otp = await this.verifyToken(user, token);
            await this.prismaService.otp.update({
                where: {
                    id: otp.id,
                },
                data: {
                    is_active: false,
                },
            });
            await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    login_attempts: 0,
                    lock_until: null,
                },
            });
            const { access_token, refresh_token } = await this.generateTokens(user);
            await this.dbLoggerService.log({
                action: 'user.signin',
                description: 'User signed in',
                body: JSON.stringify({ userId: user.id, otp: '********' }),
                metadata,
                user_id: user.id,
            });
            await this.storeTokensInCookie(res, access_token, refresh_token, user.id, metadata.userAgent, metadata.clientIp, metadata.deviceId);
            return new ApiResponse_1.ApiResponse(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async storeTokensInCookie(res, access_token, refresh_token, user_id, userAgent, ipAddress, device_id) {
        try {
            let newDeviceId = device_id;
            if (!device_id) {
                newDeviceId = (0, uuid_1.v4)();
            }
            const existingSession = await this.prismaService.session.findFirst({
                where: {
                    device_id: newDeviceId,
                    user_id: {
                        not: user_id,
                    },
                },
            });
            if (existingSession) {
                newDeviceId = (0, uuid_1.v4)();
            }
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
            });
            res.cookie('device_id', device_id || newDeviceId, {
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
                expires: new Date('9999-12-31T23:59:59Z'),
            });
            res.cookie('access_token', access_token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(Date.now() + 1000 * 60 * 15),
            });
            await this.prismaService.session.upsert({
                where: {
                    user_id,
                    user_agent: userAgent.toLowerCase(),
                    device_id: device_id || newDeviceId,
                },
                update: {
                    token: refresh_token,
                    expires_at: dayjs().add(1, 'day').toDate(),
                    ipAddress,
                },
                create: {
                    user_id,
                    token: refresh_token,
                    expires_at: dayjs().add(1, 'day').toDate(),
                    user_agent: userAgent.toLowerCase(),
                    ipAddress,
                    device_id: newDeviceId,
                },
            });
        }
        catch (error) {
            console.log(error);
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async refreshToken(res, user_id, metadata) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: user_id,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
            }
            if (user.is_suspended) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.accout_suspended);
            }
            const { access_token, refresh_token } = await this.generateTokens(user);
            await this.storeTokensInCookie(res, access_token, refresh_token, user.id, metadata.userAgent, metadata.ipAddress, metadata.deviceId);
            return new ApiResponse_1.ApiResponse(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async getUserById(id) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException(errors_1.authErrors.invalidCredentials);
            }
            return user;
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async signOut(metadata, res) {
        try {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.clearCookie('device_id');
            await this.prismaService.session.deleteMany({
                where: {
                    user_id: metadata.user_id,
                    user_agent: metadata.userAgent.toLowerCase(),
                    device_id: metadata.deviceId,
                },
            });
            await this.cacheManager.del('USER-' + metadata.user);
            await this.prismaService.activity_log.create({
                data: {
                    user_id: metadata.user,
                    action: 'user.signout',
                    body: null,
                    description: 'User signed out',
                    ip_addres: metadata.clientIp,
                    user_agent: metadata?.userAgent?.toLowerCase(),
                },
            });
            return new ApiResponse_1.ApiResponse(null);
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        messenger_service_1.MessengerService,
        jwt_1.JwtService,
        logger_service_1.DBLoggerService,
        cache_manager_1.Cache])
], AuthService);
//# sourceMappingURL=auth.service.js.map