import { otp_reoson } from '@prisma/client';
export declare class ISignIn {
    email: string;
    password: string;
    agency_slug: string;
}
export declare class IVerifyOTP {
    otp: string;
    identity: number;
}
export declare class OTPReason {
    reason: otp_reoson;
}
