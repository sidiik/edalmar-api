import { PrismaService } from 'src/prisma.service';
import { ISignIn, OTPReason } from './auth.dto';
import { ApiResponse } from 'helpers/ApiResponse';
import { MessengerService } from 'src/messenger/messenger.service';
import { otp_reoson, user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Cache } from '@nestjs/cache-manager';
import { DBLoggerService } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly prismaService;
    private readonly messengerService;
    private readonly jwtService;
    private readonly dbLoggerService;
    private cacheManager;
    private readonly configService;
    constructor(prismaService: PrismaService, messengerService: MessengerService, jwtService: JwtService, dbLoggerService: DBLoggerService, cacheManager: Cache, configService: ConfigService);
    requestOTP(data: OTPReason, metadata: any): Promise<ApiResponse<{
        is2faEnabled: boolean;
        identity: number;
    }>>;
    whoAmI(user_id: number): Promise<unknown>;
    signIn(data: ISignIn, res: Response, metadata: any): Promise<ApiResponse<{
        is2faEnabled: boolean;
    }>>;
    resetLoginAttempts(email: string): Promise<void>;
    generateTokens(user: user): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    sendOtpMessage({ user, phoneNumberId, authToken, reason, }: {
        user: user;
        agencyName: string;
        phoneNumberId: string;
        authToken: string;
        reason?: string;
    }): Promise<ApiResponse<{
        is2faEnabled: boolean;
        identity: number;
    }>>;
    verifyToken(user: user, token?: string, ignore?: boolean, reason?: otp_reoson): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        otp: string;
        user_id: number;
        reason: import(".prisma/client").$Enums.otp_reoson;
        is_active: boolean;
        expires_at: Date;
    }>;
    getTokensThroughOtp(token: string, identity: number, res: Response, metadata: any): Promise<ApiResponse<any>>;
    storeTokensInCookie(res: Response, access_token: string, refresh_token: string, user_id: number, userAgent: string, ipAddress: string, device_id?: string): Promise<void>;
    refreshToken(res: Response, user_id: number, metadata: any): Promise<ApiResponse<any>>;
    getUserById(id: number): Promise<{
        id: number;
        created_at: Date;
        updated_at: Date;
        email: string;
        whatsapp_number: string;
        address: string;
        firstname: string;
        lastname: string;
        first_login: boolean;
        profile_url: string | null;
        login_attempts: number;
        lock_until: Date | null;
        is_2fa_enabled: boolean;
        is_suspended: boolean;
        password: string;
        phone_number: string;
        role: import(".prisma/client").$Enums.role;
        refresh_token_version: string | null;
    }>;
    signOut(metadata: any, res: Response): Promise<ApiResponse<any>>;
}
