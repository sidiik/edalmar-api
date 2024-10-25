import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { MessengerModule } from './messenger/messenger.module';
import { IpMiddleware } from 'middlewares/metadata.middleware';

@Module({
  imports: [SeedModule, AuthModule, MessengerModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*');
  }
}
