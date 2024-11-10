import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import {
  ICreateTraveler,
  IListTravelersFilters,
  IUpdateTraveler,
} from './traveler.dto';
import { AgencyService } from 'src/agency/agency.service';
import { ApiResponse } from 'helpers/ApiResponse';
import { travelerErrors } from 'constants/index';
import { actions } from 'constants/actions';
import { ApiException } from 'helpers/ApiException';
import { agent_role, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class TravelerService {
  private readonly logger = new Logger(TravelerService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dbLogger: DBLoggerService,
    private readonly agencyService: AgencyService,
  ) {}

  //   Create a new traveler
  async createTraveler(data: ICreateTraveler, metadata: any) {
    try {
      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      this.logger.log("Checking if agency is disabled or doesn't exist");
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      this.logger.log(
        'Checking if traveler exists via phone, email or whatsapp',
      );

      const traveler = await this.prismaService.traveler.findFirst({
        where: {
          OR: [
            { phone: data.phone },
            { email: data.email },
            { whatsapp_number: data.whatsappNumber },
          ],
          agency: {
            slug: data.agencySlug,
          },
        },
      });

      if (traveler) {
        this.logger.warn('Traveler already exists, skipping creation');
        throw new ConflictException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerExists,
            HttpStatus.CONFLICT,
          ),
        );
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

      // Store the log in the database
      this.logger.log('Storing log in the database');
      await this.dbLogger.log({
        action: actions.traveler.created,
        description: `Traveler ${newTraveler.first_name} ${newTraveler.last_name} created`,
        body: JSON.stringify(data),
        metadata: metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(newTraveler);
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  //   Update a traveler
  async updateTraveler(data: IUpdateTraveler, metadata: any) {
    try {
      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

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
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      this.logger.log(
        "Checking if traveler's phone number, email or whatsapp number is already linked to another user",
      );
      const existingTraveler = await this.prismaService.traveler.findFirst({
        where: {
          OR: [
            { phone: data.phone },
            { email: data.email },
            { whatsapp_number: data.whatsappNumber },
          ],
          NOT: {
            id: data.travelerId,
          },
          agency: {
            slug: data.agencySlug,
          },
        },
      });

      if (existingTraveler) {
        this.logger.warn(
          'Phone number, email or whatsapp number already linked to another traveler',
        );
        throw new ConflictException(
          ApiResponse.failure(
            null,
            travelerErrors.newTravelerContentExists,
            HttpStatus.CONFLICT,
          ),
        );
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
      // Store the log in the database
      this.logger.log('Storing log in the database');
      await this.dbLogger.log({
        action: actions.traveler.updated,
        description: `Traveler ${updatedTraveler.first_name} ${updatedTraveler.last_name} updated`,
        body: JSON.stringify(data),
        metadata: metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(updatedTraveler);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  //   Get Traveler
  async getTraveler(travelerId: number, agencySlug: string, metadata: any) {
    try {
      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(metadata.user, agencySlug, [
        agent_role.admin,
        agent_role.editor,
      ]);

      this.logger.log('Checking if traveler exists');
      const traveler = await this.prismaService.traveler.findFirst({
        where: {
          id: travelerId,
          agency: {
            slug: agencySlug,
          },
        },
      });

      if (!traveler) {
        this.logger.warn('Traveler not found');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      this.logger.log('Traveler found successfully');
      return ApiResponse.success(traveler);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async listTravelers(filters: IListTravelersFilters, metadata: any) {
    try {
      this.logger.log("Checking if agency is disabled or doesn't exist");
      await this.agencyService.checkAgencyDisabled(filters.agencySlug);

      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        filters.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

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
              mode: Prisma.QueryMode.insensitive,
            },
        last_name: !filters.lastname
          ? undefined
          : {
              contains: filters.lastname,
              mode: Prisma.QueryMode.insensitive,
            },
        phone: !filters.phoneNumber
          ? undefined
          : {
              contains: filters.phoneNumber,
              mode: Prisma.QueryMode.insensitive,
            },
        whatsapp_number: !filters.whatsappNumber
          ? undefined
          : {
              contains: filters.whatsappNumber,
              mode: Prisma.QueryMode.insensitive,
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
      return ApiResponse.success({
        data: travelers,
        totalCount,
        page,
        size,
        totalPages,
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }
}
