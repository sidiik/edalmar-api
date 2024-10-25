import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ISignIn, IVerifyOTP } from './auth.dto';
import { Response, Request } from 'express';

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
}
