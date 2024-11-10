import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import {
  IBookingFilters,
  ICreateBooking,
  IGetBooking,
  IUpdateBooking,
} from './booking.dto';
import { ApiException } from 'helpers/ApiException';
import { AgencyService } from 'src/agency/agency.service';
import { ApiResponse } from 'helpers/ApiResponse';
import { travelerErrors } from 'constants/';
import { actions } from 'constants/actions';
import { agent_role, Prisma } from '@prisma/client';

@Injectable()
export class BookingService {
  private logger = new Logger(BookingService.name);
  constructor(
    private prismaService: PrismaService,
    private dbLogger: DBLoggerService,
    private agencyService: AgencyService,
  ) {}

  async createBooking(data: ICreateBooking, metadata: any) {
    try {
      // Check if agency is disabled
      this.logger.log('Checking if agency is disabled');
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if the user is linked to an agency
      this.logger.log('Checking if the user is linked to an agency');
      const { agent } = await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      //   Check if the traveler exists
      this.logger.log('Checking if traveler exists via id');
      const traveler = await this.prismaService.traveler.findUnique({
        where: {
          id: data.travelerId,
        },
      });

      if (!traveler) {
        this.logger.warn('Traveler does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      //   Create a new booking
      this.logger.log('Creating a new booking');

      const booking = await this.prismaService.booking.create({
        data: {
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
          booking_description: data.bookingDescription,
          agent: {
            connect: {
              id: agent.id,
            },
          },
        },
      });

      //   Log the booking creation
      this.logger.log('Booking created successfully');
      this.dbLogger.log({
        action: actions.booking.created,
        body: JSON.stringify(data),
        description: `Booking created for traveler ${traveler.first_name} ${traveler.last_name}`,
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(booking);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async updateBooking(data: IUpdateBooking, metadata: any) {
    try {
      // Check if agency is disabled
      this.logger.log('Checking if agency is disabled');
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if the user is linked to an agency
      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      //   Check if the traveler exists
      this.logger.log('Checking if traveler exists via id');
      const traveler = await this.prismaService.traveler.findUnique({
        where: {
          id: data.travelerId,
          agency: {
            slug: data.agencySlug,
          },
        },
      });

      if (!traveler) {
        this.logger.warn('Traveler does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      //   Check if the booking exists
      this.logger.log('Checking if booking exists via id');
      const booking = await this.prismaService.booking.findUnique({
        where: {
          id: data.bookingId,
        },
      });

      if (!booking) {
        this.logger.warn('Booking does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.bookingNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      //   Update the booking
      this.logger.log('Updating the booking');

      const updatedBooking = await this.prismaService.booking.update({
        where: {
          id: data.bookingId,
        },
        data: {
          booking_description: data.bookingDescription,
          traveler: {
            connect: {
              id: data.travelerId,
            },
          },
        },
      });

      //   Log the booking update
      this.logger.log('Booking updated successfully');
      this.dbLogger.log({
        action: actions.booking.updated,
        body: JSON.stringify(data),
        description: `Booking updated for traveler ${traveler.first_name} ${traveler.last_name}`,
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(updatedBooking);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async listBookings(filters: IBookingFilters, metadata: any) {
    try {
      // Check if the user is linked to an agency
      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        filters.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      const { page, size } = filters;
      const skip = (page - 1) * size;

      const whereClause: Prisma.bookingWhereInput = {
        traveler: {
          phone: !filters.travelerPhone
            ? undefined
            : {
                contains: filters.travelerPhone,
                mode: Prisma.QueryMode.insensitive,
              },

          whatsapp_number: !filters.whatsappPhoneNumber
            ? undefined
            : {
                contains: filters.whatsappPhoneNumber,
                mode: Prisma.QueryMode.insensitive,
              },
        },
        agency: {
          slug: filters.agencySlug,
        },
      };

      const bookings = await this.prismaService.booking.findMany({
        skip,
        take: size,
        where: whereClause,
        orderBy: {
          created_at: 'desc',
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

      const totalCount = await this.prismaService.booking.count({
        where: whereClause,
      });

      return new ApiResponse({
        data: bookings,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        page,
        size,
      });
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async getBooking(filters: IGetBooking, metadata: any) {
    try {
      // Check if agency is disabled
      this.logger.log('Checking if agency is disabled');
      await this.agencyService.checkAgencyDisabled(filters.agencySlug);

      // Check if the user is linked to an agency
      this.logger.log('Checking if the user is linked to an agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        filters.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      //   Check if the booking exists
      this.logger.log('Checking if booking exists via id');
      const booking = await this.prismaService.booking.findUnique({
        where: {
          id: +filters.bookingId,
          agency: {
            slug: filters.agencySlug,
          },
        },
        include: {
          traveler: true,
          tickets: {
            include: {
              ticket_media: true,
            },
          },
          agent: {
            select: {
              id: true,
              agent_status: true,
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  phone_number: true,
                  whatsapp_number: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!booking) {
        this.logger.warn('Booking does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.bookingNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return ApiResponse.success(booking);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }
}
