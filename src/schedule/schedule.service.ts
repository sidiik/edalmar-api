import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { MessengerService } from 'src/messenger/messenger.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(
    private prismaService: PrismaService,
    private messengerService: MessengerService,
  ) {}

  @Cron('* * * * *')
  async handleSendMessage() {
    const tickets = await this.prismaService.ticket.findMany({
      where: {
        AND: [
          {
            booking: {
              agency: {
                slug: 'daalo-airlines-travel-agency',
              },
            },
          },
          {
            departure_time: {
              lte: dayjs().add(3, 'day').toDate(),
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
        booking: {
          include: {
            traveler: true,
            agency: true,
          },
        },
      },
    });

    for (const ticket of tickets) {
      if (ticket.ticket_media.media_url) {
        await this.prismaService.ticket.update({
          where: {
            id: ticket.id,
          },
          data: {
            last_notified: dayjs().toDate(),
          },
        });

        const {
          booking: { agency, traveler },
        } = ticket;

        await this.messengerService.sendWATicketAlert({
          phoneNumberId: process.env.PHONE_NUMBER_ID,
          daysLeft: dayjs(ticket.departure_time).diff(dayjs(), 'days'),
          authToken: process.env.AUTH_TOKEN,
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
