import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { MessengerService } from 'src/messenger/messenger.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScheduleService {
  private logger = new Logger(ScheduleService.name);

  constructor(
    private prismaService: PrismaService,
    private messengerService: MessengerService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('* * * * *')
  async handleSendMessage() {
    const tickets = await this.prismaService.ticket.findMany({
      where: {
        AND: [
          {
            departure_time: {
              lte: dayjs().add(3, 'day').toDate(),
              gte: dayjs().startOf('day').toDate(),
            },
          },
          {
            OR: [
              { last_notified: null },
              {
                last_notified: {
                  lt: dayjs().startOf('day').toDate(),
                },
              },
              {
                last_notified: {
                  gt: dayjs().endOf('day').toDate(),
                },
              },
            ],
          },
        ],
      },
      include: {
        ticket_media: true,
        traveler: true,
        agency: true,
      },
    });

    this.logger.log(
      `Found ${tickets.length} tickets to notify about ` +
        JSON.stringify(tickets),
    );

    for (const ticket of tickets) {
      this.logger.log(
        `Checking if ticket ${ticket.id} has media ` +
          JSON.stringify(ticket?.ticket_media),
      );
      if (ticket?.ticket_media?.media_url) {
        this.logger.log(
          `Sending message to ${ticket.traveler.whatsapp_number}`,
        );

        await this.prismaService.ticket.update({
          where: {
            id: ticket.id,
          },
          data: {
            last_notified: dayjs().toDate(),
          },
        });

        this.logger.log(`Updating last notified for ticket [${ticket.id}]`);

        const { agency, traveler } = ticket;

        this.logger.log(`Sending message to ${traveler.whatsapp_number}`);

        await this.messengerService.sendWATicketAlert({
          phoneNumberId: this.configService.get('PHONE_NUMBER_ID'),
          daysLeft: dayjs(ticket.departure_time).diff(dayjs(), 'days'),
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
          time: dayjs(ticket.departure_time).format('hh:mm A'),
          travelerName: `${traveler.first_name} ${traveler.last_name}`,
          travelerWhatsappNumber: traveler.whatsapp_number,
        });
      }
    }
  }
}
