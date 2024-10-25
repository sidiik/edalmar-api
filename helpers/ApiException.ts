import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    response: any = 'Something went wrong, Please contact support.',
    status: HttpStatus = 500,
  ) {
    super(response, status);
  }
}
