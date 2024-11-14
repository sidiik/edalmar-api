import { agent_status } from '@prisma/client';
export declare class ICreateAgency {
    agencyName: string;
    address: string;
    phone: string;
    email: string;
}
export declare class IUpdateAgency {
    agencyName: string;
    address: string;
    maxAgents: number;
    phone: string;
    email: string;
    agencyId: number;
    markAsDisabled: boolean;
}
export declare class IUpdateAgencyKeys {
    twilioSid: string;
    twilioAuthToken: string;
    twilioPhoneNumber: string;
    whatsappAuthToken: string;
    agencyId: number;
}
export declare class IAddAgent {
    status: agent_status;
    user_id: number;
    agencySlug: string;
}
export declare class IListAgencyFilters {
    name: string;
    agency_disabled: string;
    phone: string;
    page: number;
    size: number;
}
export declare class ILinkAgent {
    email: string;
    agencySlug: string;
    agent_status: agent_status;
}
export declare class IResetAgentPassword {
    email: string;
    newPassword: string;
    agencySlug: string;
}
