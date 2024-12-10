import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import {
  ICreateTicket,
  IMessageTicket,
  IRemoveTicket,
  ITicketListFilters,
  IUpdateTickets,
  IUploadTicketMedia,
  PermenantTicketDelete,
} from './ticket.dto';
import { ApiResponse } from 'helpers/ApiResponse';
import { travelerErrors } from 'constants/index';
import { AgencyService } from 'src/agency/agency.service';
import { agent_role, otp_reoson, Prisma, user } from '@prisma/client';
import { actions } from 'constants/actions';
import { ApiException } from 'helpers/ApiException';
import * as dayjs from 'dayjs';
import { AuthService } from 'src/auth/auth.service';
import * as AWS from 'aws-sdk';
import { MessengerService } from 'src/messenger/messenger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketService {
  private logger = new Logger(TicketService.name);
  private s3: AWS.S3;

  constructor(
    private prismaService: PrismaService,
    private dbLoggerService: DBLoggerService,
    private agencyService: AgencyService,
    private authService: AuthService,
    private messengerService: MessengerService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
    });
  }

  async createTicket(data: ICreateTicket, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
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

      for (const ticket of data.tickets) {
        const ticketData: Prisma.ticketCreateInput = {
          arrival_city: ticket.arrivalCity,
          arrival_time: dayjs(ticket.arrivalTime).toDate(),
          traveler: {
            connect: {
              id: data.travelerId,
            },
          },
          departure_city: ticket.departureCity,
          departure_time: dayjs(ticket.departureTime).toDate(),
          flight_number: ticket.flightNumber,
          ticket_reference: ticket.ticketReference,
          return_date: ticket.returnDate
            ? dayjs(ticket.returnDate).toDate()
            : undefined,

          agency: {
            connect: {
              slug: data.agencySlug,
            },
          },
        };

        // Create ticket
        this.logger.log('Creating ticket');
        await this.prismaService.ticket.create({
          data: ticketData,
        });

        // Log ticket creation
        this.logger.log('Logging ticket creation');
        await this.dbLoggerService.log({
          action: actions.tickets.created,
          body: JSON.stringify(data),
          description: `Ticket created for traveler ${data.travelerId}`,
          metadata,
          user_id: metadata.user,
        });
      }

      return ApiResponse.success(null);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async updateTicket(data: IUpdateTickets, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
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
        this.logger.warn('Traveler does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.travelerNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      for (const ticket of data.tickets) {
        const ticketData: Prisma.ticketUpdateInput = {
          arrival_city: ticket.arrivalCity,
          arrival_time: dayjs(ticket.arrivalTime).toDate(),
          departure_city: ticket.departureCity,
          departure_time: dayjs(ticket.departureTime).toDate(),
          flight_number: ticket.flightNumber,
          return_date: ticket.returnDate
            ? dayjs(ticket.returnDate).toDate()
            : undefined,

          traveler: {
            connect: {
              id: data.travelerId,
            },
          },
        };

        // Update ticket
        this.logger.log('Updating ticket');
        await this.prismaService.ticket.update({
          where: {
            id: ticket.ticketId,
          },
          data: ticketData,
        });

        // Log ticket update
        this.logger.log('Logging ticket update');
        await this.dbLoggerService.log({
          action: actions.tickets.updated,
          body: JSON.stringify(data),
          description: `Ticket updated for traveler ${data.travelerId}`,
          metadata,
          user_id: metadata.user,
        });
      }

      return ApiResponse.success(null);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async removeTicket(data: IRemoveTicket, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      if (data.moveToRecycleBin === data.restoreFromRecycleBin) {
        this.logger.warn('Invalid operation');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.invalidOperation,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      // Get ticket
      this.logger.log('Getting ticket');
      const ticket = await this.prismaService.ticket.findUnique({
        where: {
          id: data.ticketId,
          agency: {
            slug: data.agencySlug,
          },
        },
      });

      if (!ticket) {
        this.logger.warn('Ticket does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.ticketNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      if (!ticket.is_deleted && data.restoreFromRecycleBin) {
        this.logger.warn('Ticket is not in the recycle bin');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.ticketNotInRecycleBin,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      if (ticket.is_deleted && data.moveToRecycleBin) {
        this.logger.warn('Ticket is already in the recycle bin');
        throw new BadRequestException(
          ApiResponse.failure(
            null,
            travelerErrors.ticketInRecycleBin,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      if (ticket.is_deleted && data.restoreFromRecycleBin) {
        await this.prismaService.ticket.update({
          where: {
            id: data.ticketId,
          },
          data: {
            is_deleted: false,
          },
        });
      }

      if (!ticket.is_deleted && data.moveToRecycleBin) {
        await this.prismaService.ticket.update({
          where: {
            id: data.ticketId,
          },
          data: {
            is_deleted: true,
          },
        });
      }

      // Log ticket removal
      this.logger.log('Logging ticket removal');
      await this.dbLoggerService.log({
        action: actions.tickets.deleted,
        body: JSON.stringify(data),
        description: `Ticket  with id ${data.ticketId} has been ${data.moveToRecycleBin ? `Moved to ` : 'Restored from'} Recycle bin`,
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(null);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async listTickets(filters: ITicketListFilters, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(filters.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        filters.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      const { page, size } = filters;

      const skip = (page - 1) * size;

      const where: Prisma.ticketWhereInput = {
        traveler: {
          id: !JSON.parse(filters.travelerId) ? undefined : +filters.travelerId,
          agency: {
            slug: filters.agencySlug,
          },
          phone: filters.travelerPhone
            ? { contains: filters.travelerPhone }
            : undefined,
          whatsapp_number: filters.whatsappNumber
            ? { contains: filters.whatsappNumber }
            : undefined,
        },
        is_deleted:
          filters.isDeleted === 'true'
            ? true
            : filters.isDeleted === 'false'
              ? false
              : undefined,

        created_at: {
          gte: !filters.startDate
            ? undefined
            : dayjs(filters.startDate).toDate(),
          lte: !filters.endDate
            ? undefined
            : dayjs(filters.endDate).endOf('day').toDate(),
        },

        departure_time: !filters.departureDate
          ? undefined
          : dayjs(filters.departureDate).toDate(),
      };

      // Get tickets
      this.logger.log('Getting tickets');
      const tickets = await this.prismaService.ticket.findMany({
        where,
        take: size,
        skip,
        orderBy: {
          id: 'desc',
        },
        include: {
          ticket_media: true,
          traveler: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              image_url: true,
              phone: true,
              whatsapp_number: true,
            },
          },
        },
      });

      const totalCount = await this.prismaService.ticket.count({
        where,
      });

      return ApiResponse.success({
        data: tickets,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        page,
        size,
      });
    } catch (error) {
      throw new ApiException(error.response, error.status);
    }
  }

  async deleteTicket(data: PermenantTicketDelete, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin],
      );

      // Check if the code is valid
      this.logger.log('Checking if code is valid');
      await this.authService.verifyToken(
        { id: metadata.user } as user,
        data.code,
        false,
        otp_reoson.delete_ticket,
      );

      // Get ticket
      this.logger.log('Getting ticket');
      const ticket = await this.prismaService.ticket.findUnique({
        where: {
          id: data.ticketId,
          agency: {
            slug: data.agencySlug,
          },
        },
      });

      if (!ticket) {
        this.logger.warn('Ticket does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.ticketNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      // Delete ticket
      this.logger.log('Deleting ticket');
      await this.prismaService.ticket.delete({
        where: {
          id: data.ticketId,
        },
      });

      // Log ticket deletion
      this.logger.log('Logging ticket deletion');
      await this.dbLoggerService.log({
        action: actions.tickets.deleted,
        body: JSON.stringify(data),
        description: `Ticket with id ${data.ticketId} has been permanently deleted`,
        metadata,
        user_id: metadata.user,
      });

      return ApiResponse.success(null);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async uploadTicketMedia(
    file: Express.Multer.File,
    data: IUploadTicketMedia,
    metadata: any,
  ) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if agent is linked to agency
      this.logger.log('Checking if agent is linked to agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      console.log(data);

      // Check if the ticket exists
      this.logger.log('Checking if ticket exists');
      const ticket = await this.prismaService.ticket.findFirst({
        where: {
          id: +data.ticketId,
          agency: {
            slug: data.agencySlug,
          },
        },
        include: {
          ticket_media: true,
          traveler: true,
          agency: true,
        },
      });

      if (!ticket) {
        this.logger.warn('Ticket does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.ticketNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      if (ticket?.ticket_media?.media_url) {
        // Delete existing media
        this.logger.log('Deleting existing media');
        await this.prismaService.ticket_media.deleteMany({
          where: {
            ticket_id: +data.ticketId,
          },
        });

        await this.s3DeleteKey(ticket.ticket_media.key);
      }

      this.logger.log('Uploading media');
      const s3Response = await this.s3Upload(
        file.buffer,
        this.keyNameGenerator({ ticket }),
        file.mimetype,
      );

      // Log media upload
      this.logger.log('Logging media upload');
      await this.dbLoggerService.log({
        action: actions.tickets.updated,
        body: JSON.stringify(data),
        description: `Media uploaded for ticket ${data.ticketId}`,
        metadata,
        user_id: metadata.user,
      });

      // Add ticket media table to this record
      await this.prismaService.ticket_media.create({
        data: {
          ticket: {
            connect: {
              id: +data.ticketId,
            },
          },
          key: s3Response.Key,
          media_url: 'https://d3hae587xffvqe.cloudfront.net/' + s3Response.Key,
        },
      });

      return ApiResponse.success(null);
    } catch (error) {
      console.log('ERROR: ', error);
      this.logger.error('ERROR: ' + error);
      throw new ApiException(error.response, error.status);
    }
  }

  async s3Upload(file: any, name: string, mimetype: string) {
    try {
      const params = {
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: name,
        Body: file,
        // ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
      };
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async s3DeleteKey(key: string) {
    try {
      const params = {
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: key,
      };
      let s3Response = await this.s3.deleteObject(params).promise();
      return s3Response;
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  async messageTicket(data: IMessageTicket, metadata: any) {
    try {
      // check if agency is disabled
      await this.agencyService.checkAgencyDisabled(data.agencySlug);

      // Check if the agent is linked to the agency
      this.logger.log('Checking if agent is linked to agency');
      await this.agencyService.checkAgentLinked(
        metadata.user,
        data.agencySlug,
        [agent_role.admin, agent_role.editor],
      );

      // Check if the ticket exists
      this.logger.log('Checking if ticket exists');
      const ticket = await this.prismaService.ticket.findUnique({
        where: {
          id: +data.ticketId,
          agency: {
            slug: data.agencySlug,
          },
        },
        include: {
          ticket_media: true,
          agency: true,
          traveler: true,
        },
      });

      if (!ticket || ticket.is_deleted) {
        this.logger.warn('Ticket does not exist');
        throw new NotFoundException(
          ApiResponse.failure(
            null,
            travelerErrors.ticketNotFound,
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      // Send message
      this.logger.log('Sending message');

      const { agency, traveler } = ticket;

      await this.messengerService.sendWATicketNotification({
        phoneNumberId: this.configService.get('PHONE_NUMBER_ID'),
        authToken: this.configService.get('AUTH_TOKEN'),
        agencyName: agency.name,
        agencyPhoneNumber: agency.phone,
        agencyWhatsappNumber: agency.phone,
        arrival: ticket.arrival_city,
        departure: ticket.departure_city,
        flightNumber: ticket.flight_number,
        date: dayjs(ticket.departure_time).format('DD MMM YYYY'),
        mediaUrl: ticket.ticket_media.media_url,
        seatNumber: 'N/A',
        time: dayjs(ticket.departure_time).format('HH:mm'),
        travelerName: `${traveler.first_name} ${traveler.last_name}`,
        travelerWhatsappNumber: traveler.whatsapp_number,
      });

      return ApiResponse.success(null);
    } catch (error) {
      this.logger.error(error);
      throw new ApiException(error.response, error.status);
    }
  }

  private keyNameGenerator({ ticket }: { ticket: any }) {
    return `${ticket.agency.slug}/tickets/travelerPhone-${ticket.traveler.phone}-ticketId-000${ticket.id}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}`;
  }
}
