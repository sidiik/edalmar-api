import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  ICreateAgency,
  ILinkAgent,
  IListAgencyFilters,
  IUpdateAgency,
} from './agency.dto';
import { ApiException } from 'helpers/ApiException';
import { genSlug } from 'helpers/slug';
import { agencyErrors } from 'constants/index';
import { ApiResponse } from 'helpers/ApiResponse';
import { Request } from 'express';
import { actions } from 'constants/actions';
import { DBLoggerService } from 'src/logger/logger.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AgencyService {
  private readonly logger = new Logger();
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dbLogger: DBLoggerService,
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

      await this.prismaService.agency.create({
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

      return new ApiResponse(null);
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

      await this.prismaService.agency.update({
        where: {
          id: agencyId,
        },
        data: {
          name: rest.agencyName,
          address: rest.address,
          phone: rest.phone,
          email: rest.email,
          slug,
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

      return new ApiResponse(null);
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  // Link an agent to an agency
  async linkAgent(data: ILinkAgent, req: Request) {
    try {
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

      this.logger.log('Check if agent exists');
      const agent = await this.prismaService.agent.findUnique({
        where: {
          user_id: user.id,
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
}
