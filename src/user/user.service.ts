import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import { ICreateUser, IUpdateUser, IUserFilters } from './user.dto';
import { ApiException } from 'helpers/ApiException';
import { userErrors } from 'constants/index';
import { ApiResponse } from 'helpers/ApiResponse';
import * as argon2 from 'argon2';
import { actions } from 'constants/actions';
import { role } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dbLoggerService: DBLoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Get all users
  async getAllUsers(filters: IUserFilters) {
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
        is_suspended:
          filters.isSuspended === 'true'
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

        role: !filters.role ? undefined : (filters.role as role),
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

      return new ApiResponse({
        data: users,
        page,
        size,
        totalCount,
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  //   Create user
  async createUser(data: ICreateUser, metadata: any) {
    try {
      this.logger.log('Check if user exists');
      const emailTaken = await this.prismaService.user.findUnique({
        where: {
          email: data.email,
        },
      });

      // check if phone or whatsapp is taken
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
        throw new ConflictException(
          ApiResponse.failure(null, userErrors.userExists, HttpStatus.CONFLICT),
        );
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
        action: actions.user.created,
        description: `User ${data.email} created`,
        body: JSON.stringify(rest),
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  //   Update user
  async updateUser(data: IUpdateUser, metadata: any) {
    try {
      this.logger.log('Check if user exists');
      const user = await this.prismaService.user.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!user) {
        throw new ConflictException(
          ApiResponse.failure(
            null,
            userErrors.userNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
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
        throw new ConflictException(
          ApiResponse.failure(
            null,
            userErrors.emailExists,
            HttpStatus.CONFLICT,
          ),
        );
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

      // Restore the cache
      if (await this.cacheManager.get('USER-' + updatedUser.id)) {
        const { password, login_attempts, is_suspended, lock_until, ...rest } =
          updatedUser;
        await this.cacheManager.set('USER-' + updatedUser.id, rest);
      }

      this.logger.log('Store the activity log');
      await this.dbLoggerService.log({
        action: actions.user.updated,
        description: `User ${data.email} updated`,
        body: JSON.stringify(data),
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // List my linked agencies
  async listMyLinkedAgencies(userId: number) {
    try {
      const agencies = await this.prismaService.agency.findMany({
        where: {
          agent: {
            some: {
              user_id: userId,
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
            },
          },
        },
      });

      return ApiResponse.success({
        data: agencies,
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }
}
