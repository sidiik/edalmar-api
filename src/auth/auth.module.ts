import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { MessengerModule } from 'src/messenger/messenger.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'constants/index';
import { DBLoggerService } from 'src/logger/logger.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, DBLoggerService],
  exports: [AuthService],
  imports: [
    MessengerModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class AuthModule {}
