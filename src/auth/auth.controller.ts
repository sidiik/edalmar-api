import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ISignIn, IVerifyOTP, OTPReason } from './auth.dto';
import { Response, Request } from 'express';
import { RefreshGuard } from 'guards/refresh.guard';
import { AuthGuard } from 'guards/jwt.guard';
import { role } from '@prisma/client';
import { Roles } from 'decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(
    @Body() data: ISignIn,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(data, res, req.metadata);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyOtp(
    @Body() data: IVerifyOTP,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.getTokensThroughOtp(
      data.otp,
      data.identity,
      res,
      req.metadata,
    );
  }

  @Post('refresh_token')
  @UseGuards(RefreshGuard)
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshToken(res, req['user_id'], req.metadata);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(req.metadata, res);
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@Req() req: Request) {
    return this.authService.whoAmI(req.metadata.user);
  }

  @Post('request-otp')
  @UseGuards(AuthGuard)
  @Roles(role.admin, role.agent_user, role.customer)
  requestOtp(@Body() data: OTPReason, @Req() req: Request) {
    return this.authService.requestOTP(data, req.metadata);
  }
}
