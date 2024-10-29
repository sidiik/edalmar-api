import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  ICreateAgency,
  ILinkAgent,
  IListAgencyFilters,
  IResetAgentPassword,
  IUpdateAgency,
  IUpdateAgencyKeys,
} from './agency.dto';
import { ApiException } from 'helpers/ApiException';
import { genSlug } from 'helpers/slug';
import { agencyErrors, userErrors } from 'constants/index';
import { ApiResponse } from 'helpers/ApiResponse';
import { Request } from 'express';
import { actions } from 'constants/actions';
import { DBLoggerService } from 'src/logger/logger.service';
import { Prisma, role, user } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as argon2 from 'argon2';
import { IModifyAgentStatus } from 'src/user/user.dto';

@Injectable()
export class AgencyService {
  private readonly logger = new Logger();
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dbLogger: DBLoggerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // get all agencies
  async getAgencies(filters: IListAgencyFilters) {
    try {
      const { page, size } = filters;
      const skip = (page - 1) * size;

      const whereClause = {
        name: !filters.name
          ? undefined
          : {
              contains: filters.name,
              mode: Prisma.QueryMode.insensitive,
            },
        agency_disabled:
          filters.agency_disabled === 'true'
            ? true
            : filters.agency_disabled === 'false'
              ? false
              : undefined,
        phone: !filters.phone
          ? undefined
          : {
              equals: filters.phone,
              mode: Prisma.QueryMode.insensitive,
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

      return new ApiResponse({
        data: agencies,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        page,
        size,
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // create an agency
  async createAgency(data: ICreateAgency, req: Request) {
    try {
      const slug = genSlug(data.agencyName);
      const checkAgency = await this.prismaService.agency.findFirst({
        where: {
          slug,
        },
      });

      this.logger.log('Checking if agency exists');

      if (checkAgency) {
        throw new ConflictException(
          ApiResponse.failure(
            null,
            agencyErrors.agencyExists,
            HttpStatus.CONFLICT,
          ),
        );
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

      //   store the activity log
      await this.dbLogger.log({
        action: actions.agency.created,
        body: JSON.stringify(data),
        description: `Agency created ${data.agencyName}`,
        user_id: req.metadata.user,
        metadata: req.metadata,
      });

      return new ApiResponse(agency);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  // update an agency
  async updateAgency(data: IUpdateAgency, req: Request) {
    try {
      this.logger.log('Updating agency ' + JSON.stringify(data));
      const { agencyId, ...rest } = data;
      const slug = genSlug(rest.agencyName);
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
        throw new ConflictException(
          ApiResponse.failure(
            null,
            agencyErrors.agencyExists,
            HttpStatus.CONFLICT,
          ),
        );
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

      //   store the activity log
      await this.dbLogger.log({
        action: actions.agency.updated,
        body: JSON.stringify(data),
        description: `Agency updated ${rest.agencyName}`,
        user_id: req.metadata.user,
        metadata: req.metadata,
      });

      return new ApiResponse(agency);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Link an agent to an agency
  async linkAgent(data: ILinkAgent, req: Request) {
    try {
      this.logger.log(
        "Checking if total active agents is less than the agency's max agents",
      );

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
        throw new ConflictException(
          ApiResponse.failure(
            null,
            agencyErrors.agentNotFound,
            HttpStatus.CONFLICT,
          ),
        );
      }

      this.logger.log('Check if agency exists');
      const agency = await this.prismaService.agency.findFirst({
        where: {
          slug: data.agencySlug,
        },
      });

      if (!agency) {
        throw new ConflictException(
          ApiResponse.failure(
            null,
            agencyErrors.agencyNotFound,
            HttpStatus.CONFLICT,
          ),
        );
      }

      if (agency.agency_disabled) {
        throw new BadRequestException(
          ApiResponse.failure(
            null,
            agencyErrors.agencyDisabled,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      if (totalActiveAgents >= agency.max_agents) {
        this.logger.error('Maximum number of agents reached');
        throw new BadRequestException(
          ApiResponse.failure(
            {
              maxAgents: agency.max_agents,
              totalActiveAgents,
            },
            agencyErrors.maxAgentsReached,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      this.logger.log('Check if agent exists');
      const agent = await this.prismaService.agent.findFirst({
        where: {
          user_id: user.id,
          agency_id: agency.id,
        },
      });

      if (agent) {
        throw new ConflictException(
          ApiResponse.failure(
            null,
            agencyErrors.agentAlreadyLinked,
            HttpStatus.CONFLICT,
          ),
        );
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

      if (user.role !== role.admin && user.role !== role.agent_manager) {
        // Update user role to agent
        this.logger.log('Updating user role to agent');
        await this.prismaService.user.update({
          where: {
            email: data.email,
          },
          data: {
            role: 'agent',
          },
        });
      }

      //   store the activity log
      await this.dbLogger.log({
        action: actions.agent.linked,
        body: JSON.stringify(data),
        description: `Agent linked to ${data.agencySlug}`,
        user_id: req.metadata.user,
        metadata: req.metadata,
      });
      return new ApiResponse(null);
    } catch (error) {
      console.log(error);
      throw new ApiException(error.response, error.status);
    }
  }

  // Get all agents linked to an agency
  async getAgents(slug: string, metadata: any) {
    try {
      await this.checkAgentLinked(metadata.user, slug);
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
            },
          },
        },
      });

      return new ApiResponse(agents);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Upsert agency keys
  async upsertAgencyKeys(data: IUpdateAgencyKeys, metadata: any) {
    try {
      this.logger.log('Checking if agency exists');
      const agency = await this.prismaService.agency.findFirst({
        where: {
          id: data.agencyId,
        },
      });

      if (!agency) {
        throw new ConflictException(
          ApiResponse.failure(
            null,
            agencyErrors.agencyNotFound,
            HttpStatus.CONFLICT,
          ),
        );
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
        action: actions.agency.keysUpserted,
        body: JSON.stringify(data),
        description: `Agency keys upserted for ${agency.name}`,
        user_id: metadata.user,
        metadata,
      });

      this.logger.log('Agency keys upserted');

      return new ApiResponse(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Check if a user is linked to an agency
  /**
   ** userId: This is the user id to check if the user is linked to an agency, this is required
   ** agencySlug: This is the agency slug to check if the user is linked to, this is required
   ** isCurrentUser: This is a boolean to check if the user is the current user, this is optional and defaults to true
   ** silent: This is a boolean to check if the function should throw an error or not, if the agent is inactive, this is optional and defaults to false
   */
  async checkAgentLinked(
    userId: number,
    agencySlug: string,
    isCurrentUser: boolean = true,
    silent: boolean = false,
  ) {
    try {
      this.logger.log('Checking if agent is linked to agency');
      const user =
        isCurrentUser &&
        ((await this.cacheManager.get('USER-' + userId)) as user);

      if (!user && isCurrentUser) {
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            agencyErrors.agentNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      if (user.role === role.admin && isCurrentUser) {
        return { user };
      }

      const agent = await this.prismaService.agent.findFirst({
        where: {
          user_id: userId,
          agency: {
            slug: agencySlug,
          },
        },
      });

      if (!agent) {
        this.logger.error("Agent isn't linked to the agency");
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            agencyErrors.agencyNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      if (agent?.agent_status === 'inactive' && !silent) {
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            agencyErrors.agentNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return { user, agent };
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Reset agent password
  async resetAgentPassword(data: IResetAgentPassword, metadata: any) {
    try {
      this.logger.log(
        'Checking if agent is linked to agency ' + data.agencySlug,
      );
      await this.checkAgentLinked(metadata.user, data.agencySlug);

      const user = await this.prismaService.user.findFirst({
        where: {
          email: data.email.toLowerCase(),
        },
      });

      if (!user) {
        this.logger.log("Agent doesn't exist");
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            agencyErrors.agentNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      this.logger.log('Check if the user is linked to the agency');
      await this.checkAgentLinked(user.id, data.agencySlug, false);

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
        action: actions.agent.passwordReset,
        body: JSON.stringify(data),
        description: `Agent password reset for ${data.email}`,
        user_id: metadata.user,
        metadata,
      });

      return ApiResponse.success(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Modify agent status
  async modifyAgentStatus(data: IModifyAgentStatus, metadata: any) {
    try {
      this.logger.log('Checking if agent is linked to agency');
      const agentManager = await this.checkAgentLinked(
        metadata.user,
        data.agencySlug,
      );

      this.logger.log("Checking if agent is the current user's account");
      if (agentManager.user.email === data.email) {
        throw new BadRequestException(
          ApiResponse.failure(
            null,
            userErrors.cannotModifyOwnStatus,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      this.logger.log('Checking if user exists');
      const user = await this.prismaService.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        this.logger.error('User not found');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            agencyErrors.agentNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      this.logger.log('Checking if agent is linked to agency');
      const { agent } = await this.checkAgentLinked(
        user.id,
        data.agencySlug,
        false,
        true,
      );

      this.logger.log('Modifying agent status');
      await this.prismaService.agent.update({
        where: {
          id: agent.id,
        },
        data: {
          agent_status: data.agentStatus,
        },
      });

      if (data.role !== ('admin' as role)) {
        await this.prismaService.user.update({
          where: {
            email: data.email,
          },
          data: {
            role: data.role,
          },
        });
      }

      this.logger.log('Storing the activity log');
      await this.dbLogger.log({
        action: actions.agent.updated,
        body: JSON.stringify(data),
        description: `Agent status modified for ${data.email}`,
        user_id: metadata.user,
        metadata,
      });

      return ApiResponse.success(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }
}
