import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AgencyService } from 'src/agency/agency.service';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import {
  ApplicationPriority,
  ApplicationStatus,
  ApplicationType,
  ICreateApplication,
  IListApplications,
  IUpdateApplication,
} from './application.dto';
import { agent_role, Prisma } from '@prisma/client';
import { ApiResponse } from 'helpers/ApiResponse';
import { applicationErrors, travelerErrors } from 'constants/index';
import { actions } from 'constants/actions';
import { ApiException } from 'helpers/ApiException';
import * as dayjs from 'dayjs';

@Injectable()
export class ApplicationService {
  private logger = new Logger(ApplicationService.name);

  constructor(
    private prismaService: PrismaService,
    private dbLoggerService: DBLoggerService,
    private agencyService: AgencyService,
  ) {}

  async createApplication(data: ICreateApplication, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to this agency
      this.logger.log('Checking if agent is linked to this agency');
      const { user, agent } = await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      // Check if traveler exists
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
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      //   Check if the application reference already exists
      this.logger.log('Checking if the application reference already exists');

      const applicationReference =
        await this.prismaService.application.findFirst({
          where: {
            application_ref: data.applicationReference,
          },
        });

      if (applicationReference) {
        this.logger.warn('Application reference already exists');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            applicationErrors.applicationReferenceExists,
            HttpStatus.CONFLICT,
          ),
        );
      }

      // Create application
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

      // Log application creation
      this.logger.log('Logging application creation');
      await this.dbLoggerService.log({
        action: actions.booking.created,
        body: JSON.stringify(data),
        description: `Application created for traveler ${data.travelerId}`,
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(application);
    } catch (error) {
      console.log(error);
      this.logger.error('Error creating application', JSON.stringify(error));
      throw new ApiException(error.response, error.status);
    }
  }

  async updateApplication(data: IUpdateApplication, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to this agency
      this.logger.log('Checking if agent is linked to this agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      // Check if traveler exists
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
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      //   Check if application exists
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
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            applicationErrors.applicationNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      //   Check if the application reference already exists
      this.logger.log('Checking if the application reference already exists');

      const applicationReference =
        await this.prismaService.application.findFirst({
          where: {
            application_ref: data.applicationReference,
            id: {
              not: data.applicationId,
            },
          },
        });

      if (applicationReference) {
        this.logger.warn('Application reference already exists');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            applicationErrors.applicationReferenceExists,
            HttpStatus.CONFLICT,
          ),
        );
      }

      // update application
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

      // Log application update
      this.logger.log('Logging application update');
      await this.dbLoggerService.log({
        action: actions.booking.updated,
        body: JSON.stringify(data),
        description: `Application updated for traveler ${data.travelerId}`,
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(application);
    } catch (error) {
      this.logger.error(
        'Error updating the application',
        JSON.stringify(error),
      );
      throw new ApiException(error.response, error.status);
    }
  }

  async listApplications(filters: IListApplications, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(filters?.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        filters?.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      const { page, size } = filters;

      const skip = (page - 1) * size;

      let due;

      if (filters?.priority === ApplicationPriority.urgent) {
        due = {
          gte: dayjs().toDate(),
          lte: dayjs().add(3, 'day').toDate(),
        };
      } else if (filters?.priority === ApplicationPriority.overdue) {
        due = {
          lte: dayjs().toDate(),
        };
      } else if (filters?.priority === ApplicationPriority.normal) {
        due = {
          gte: dayjs().add(3, 'day').toDate(),
          lte: dayjs().add(7, 'day').toDate(),
        };
      } else if (filters?.priority === ApplicationPriority.low) {
        due = {
          gte: dayjs().add(7, 'day').toDate(),
          lte: dayjs().add(14, 'day').toDate(),
        };
      } else {
        due = undefined;
      }

      const where: Prisma.applicationWhereInput = {
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

        application_status:
          filters?.applicationStatus !== ApplicationStatus.all
            ? filters?.applicationStatus
            : undefined,
        application_type:
          filters?.applicationType !== ApplicationType.all
            ? filters?.applicationType
            : undefined,
        due,
      };

      // Get applications
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

      return ApiResponse.success({
        data: applications,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        page,
        size,
      });
    } catch (error) {
      console.log(error);
      throw new ApiException(error.response, error.status);
    }
  }
}
