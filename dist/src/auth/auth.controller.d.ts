import { AuthService } from './auth.service';
import { ISignIn, IVerifyOTP, OTPReason } from './auth.dto';
import { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signin(data: ISignIn, req: Request, res: Response): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        is2faEnabled: boolean;
    }>>;
    verifyOtp(data: IVerifyOTP, req: Request, res: Response): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    refreshToken(req: Request, res: Response): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    signOut(req: Request, res: Response): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    whoAmI(req: Request): Promise<unknown>;
    requestOtp(data: OTPReason, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        is2faEnabled: boolean;
        identity: number;
    }>>;
}
