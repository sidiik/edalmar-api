import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ISignIn } from './auth.dto';
import { ApiException } from 'helpers/ApiException';
import { authErrors } from 'constants/errors';
import * as argon2 from 'argon2';
import * as dayjs from 'dayjs';
import { ApiResponse } from 'helpers/ApiResponse';
import { MessengerService } from 'src/messenger/messenger.service';
import { otpGenerator } from 'utils';
import { role, user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messengerService: MessengerService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async whoAmI(user_id: number) {
    try {
      const user = await this.cacheManager.get('USER-' + user_id.toString());

      if (user) {
        return user;
      }

      const { password, login_attempts, is_suspended, lock_until, ...rest } =
        await this.prismaService.user.findUnique({
          where: {
            id: user_id,
          },
        });

      if (!rest) {
        throw new UnauthorizedException(authErrors.invalidCredentials);
      }

      await this.cacheManager.set('USER-' + rest.id.toString(), rest);

      return rest;
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Sign in
  async signIn(data: ISignIn, res: Response, metadata: any) {
    try {
      const { email, password } = data;

      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UnauthorizedException(authErrors.invalidCredentials);
      }

      if (user.is_suspended) {
        throw new UnauthorizedException(authErrors.accout_suspended);
      }

      if (
        (user.role === role.agent || user.role === role.agent_manager) &&
        data.agency_slug
      ) {
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

        let login_attempts = user.login_attempts;

        if (user.lock_until && dayjs().isBefore(user.lock_until)) {
          throw new UnauthorizedException(
            new ApiResponse(
              {
                lock_until: user.lock_until,
                login_attempts: user.login_attempts,
              },
              authErrors.account_temporarily_disabled,
              HttpStatus.UNAUTHORIZED,
            ),
          );
        } else {
          if (user.lock_until) {
            login_attempts = 0;
          }
        }

        const is_password_valid = await argon2.verify(user.password, password);

        if (!is_password_valid) {
          login_attempts = login_attempts + 1;
          if (agent.agency.account_lock_enabled) {
            await this.prismaService.user.update({
              where: {
                id: user.id,
              },
              data: {
                login_attempts,
                lock_until:
                  login_attempts >= agent.agency.user_login_attempts
                    ? dayjs()
                        .add(agent.agency.user_lock_minutes, 'minute')
                        .toDate()
                    : null,
              },
            });
          }
          throw new UnauthorizedException(
            new ApiResponse(
              {
                attempts_left:
                  agent.agency.user_login_attempts - login_attempts,
              },
              authErrors.invalidCredentials,
              HttpStatus.UNAUTHORIZED,
            ),
          );
        }

        await this.resetLoginAttempts(user.email);

        if (user.is_2fa_enabled) {
          return this.sendOtpMessage({
            user,
            agencyName: agent.agency.name,
            sid: agent.agency.agency_keys.twilio_sid,
            authToken: agent.agency.agency_keys.twilio_auth_token,
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
        await this.storeTokensInCookie(
          res,
          access_token,
          refresh_token,
          user.id,
          metadata.userAgent,
          metadata.clientIp,
          metadata.deviceId,
        );

        return new ApiResponse({
          is2faEnabled: false,
        });
      }

      let login_attempts = user.login_attempts;

      if (user.lock_until && dayjs().isBefore(user.lock_until)) {
        throw new UnauthorizedException(
          new ApiResponse(
            {
              lock_until: user.lock_until,
              login_attempts: user.login_attempts,
            },
            authErrors.account_temporarily_disabled,
            HttpStatus.UNAUTHORIZED,
          ),
        );
      } else {
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
            lock_until:
              login_attempts >= 5 ? dayjs().add(10, 'minute').toDate() : null,
          },
        });

        throw new UnauthorizedException(
          new ApiResponse(
            {
              attempts_left: 5 - login_attempts,
            },
            authErrors.invalidCredentials,
            HttpStatus.UNAUTHORIZED,
          ),
        );
      }

      await this.resetLoginAttempts(user.email);

      if (user.is_2fa_enabled) {
        return this.sendOtpMessage({
          user,
          agencyName: process.env.DEFAULT_AGENCY_NAME,
          sid: process.env.DEFAULT_SID,
          authToken: process.env.DEFAULT_AUTH_TOKEN,
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
      await this.storeTokensInCookie(
        res,
        access_token,
        refresh_token,
        user.id,
        metadata.userAgent,
        metadata.clientIp,
        metadata.deviceId,
      );

      return new ApiResponse({
        is2faEnabled: false,
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // reset login attempts and lock until
  async resetLoginAttempts(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UnauthorizedException(authErrors.invalidCredentials);
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
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // async generate access token and refresh tokens
  async generateTokens(user: user) {
    const { password, login_attempts, is_suspended, lock_until, ...rest } =
      user;
    await this.cacheManager.set('USER-' + user.id.toString(), rest);
    return {
      access_token: this.jwtService.sign(
        { subject: user.id },
        { expiresIn: '15m' },
      ),
      refresh_token: this.jwtService.sign(
        { subject: user.id, familyId: uuid },
        { expiresIn: '1d' },
      ),
    };
  }

  // Send OTP message and store it
  async sendOtpMessage({
    user,
    agencyName,
    sid,
    authToken,
  }: {
    user: user;
    agencyName: string;
    sid: string;
    authToken: string;
  }) {
    try {
      // Check for existing token
      const existingOtp = await this.verifyToken(user, undefined, true);

      if (existingOtp) {
        throw new BadRequestException(
          new ApiResponse(
            null,
            authErrors.otp_already_sent,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      const otp = otpGenerator(6);
      await this.prismaService.otp.create({
        data: {
          otp,
          user_id: user.id,
          expires_at: dayjs().add(5, 'minute').toDate(),
        },
      });
      this.messengerService.sendWaMessage(
        '14155238886',
        user.whatsapp_number,
        `Dear ${user.firstname} ${user.lastname}, Your OTP code is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
        agencyName,
        sid,
        authToken,
      );

      return new ApiResponse({ is2faEnabled: true, identity: user.id });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Verify OTP
  async verifyToken(user: user, token?: string, ignore?: boolean) {
    try {
      const otp = await this.prismaService.otp.findFirst({
        where: {
          otp: token || undefined,
          user_id: user.id,
          is_active: true,
          expires_at: {
            gt: dayjs().toDate(),
          },
        },
      });

      if (!otp && !ignore) {
        throw new BadRequestException(
          new ApiResponse(null, authErrors.otp_invalid, HttpStatus.BAD_REQUEST),
        );
      }

      return otp;
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Get tokens through OTP
  async getTokensThroughOtp(
    token: string,
    identity: number,
    res: Response,
    metadata: any,
  ) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: identity,
        },
      });

      if (!user) {
        throw new UnauthorizedException(authErrors.otp_invalid);
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
      await this.storeTokensInCookie(
        res,
        access_token,
        refresh_token,
        user.id,
        metadata.userAgent,
        metadata.clientIp,
        metadata.deviceId,
      );

      return new ApiResponse(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Store tokens into the response cookie
  async storeTokensInCookie(
    res: Response,
    access_token: string,
    refresh_token: string,
    user_id: number,
    userAgent: string,
    ipAddress: string,
    device_id?: string,
  ) {
    try {
      let newDeviceId = device_id;

      if (!device_id) {
        newDeviceId = uuid();
      }

      // check if the device id is already linked to another user
      const existingSession = await this.prismaService.session.findFirst({
        where: {
          device_id: newDeviceId,
          user_id: {
            not: user_id,
          },
        },
      });

      // generate new device id if the current device id is linked to another user
      if (existingSession) {
        newDeviceId = uuid();
      }

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      });

      res.cookie('device_id', device_id || newDeviceId, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date('9999-12-31T23:59:59Z'),
      });

      res.cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
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
    } catch (error) {
      console.log(error);
      throw new ApiException(error.response, error.status);
    }
  }

  // refresh token
  async refreshToken(res: Response, user_id: number, metadata: any) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new UnauthorizedException(authErrors.invalidCredentials);
      }

      if (user.is_suspended) {
        throw new UnauthorizedException(authErrors.accout_suspended);
      }

      const { access_token, refresh_token } = await this.generateTokens(user);

      await this.storeTokensInCookie(
        res,
        access_token,
        refresh_token,
        user.id,
        metadata.userAgent,
        metadata.ipAddress,
        metadata.deviceId,
      );

      return new ApiResponse(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // get user by id
  async getUserById(id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new UnauthorizedException(authErrors.invalidCredentials);
      }

      return user;
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Sign out
  async signOut(metadata: any, res: Response) {
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

      // Clear the cache
      await this.cacheManager.del('USER-' + metadata.user);

      // Store the activity log
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

      return new ApiResponse(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }
}
