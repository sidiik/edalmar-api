import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { MessengerModule } from './messenger/messenger.module';
import { IpMiddleware } from 'middlewares/metadata.middleware';
import { AgencyModule } from './agency/agency.module';
import { RequestLoggerMiddleware } from 'middlewares/request-logger.middleware';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { TravelerModule } from './traveler/traveler.module';
import { BookingModule } from './booking/booking.module';
import { TicketModule } from './ticket/ticket.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from 'guards/throttler.guard';
import { ScheduleMessageModule } from './schedule/schedule.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SeedModule,
    AuthModule,
    MessengerModule,
    AgencyModule,
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6739,
        password: process.env.REDIS_PASSWORD,
      },
      isGlobal: true,
      ttl: 3600000 * 3,
    }),
    UserModule,
    TravelerModule,
    BookingModule,
    TicketModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    ScheduleMessageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*');
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
