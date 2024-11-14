import { HttpException, HttpStatus } from '@nestjs/common';
export declare class ApiException extends HttpException {
    constructor(response?: any, status?: HttpStatus);
}
