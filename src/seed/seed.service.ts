import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class SeedService {
  constructor(private readonly prismaService: PrismaService) {}

  async seedUsers() {
    const users = await this.prismaService.user.count();
    if (users === 0) {
      await this.prismaService.user.create({
        data: {
          email: 'sidiikpro@gmail.com',
          firstname: 'Sidiiq',
          lastname: 'Omar',
          password: await argon2.hash('argon2'),
          role: 'admin',
          phone_number: '252636539685',
          whatsapp_number: '252636539685',
          address: 'Hargeisa Somaliland',
        },
      });

      return {
        message: 'Users seeded successfully',
        statusCode: 201,
      };
    }
  }

  async seedAgency() {
    const agency = await this.prismaService.agency.count();
    if (agency === 0) {
      const newAgency = await this.prismaService.agency.create({
        data: {
          name: 'Shaab Travel Agency',
          address: 'Hargeisa Somaliland',
          email: 'sidiikpro@gmail.com',
          phone: '252636539685',
        },
      });

      //   store agent keys
      await this.prismaService.agency_keys.create({
        data: {
          agency_id: newAgency.id,
          twilio_auth_token: 'AC7c20d04ab02f6505e062b9559a5d7513',
          twilio_sid: '6c079cb221c4fc7536fdeb6f77d5cea1',
        },
      });

      //   connect default agent
      await this.prismaService.agent.create({
        data: {
          agency: {
            connect: {
              id: newAgency.id,
            },
          },
          user: {
            connect: {
              email: 'sidiikpro@gmail.com',
            },
          },
        },
      });
    }

    return {
      message: 'Agency seeded successfully',
      statusCode: 201,
    };
  }
}
