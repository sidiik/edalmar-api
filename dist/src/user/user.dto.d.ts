import { agent_role, agent_status, role } from '@prisma/client';
export declare class ICreateUser {
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    password: string;
    is2faEnabled: boolean;
    phoneNumber: string;
    whatsappNumber: string;
}
export declare class IUpdateUser {
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    is2faEnabled: boolean;
    markAsSuspended: boolean;
    id: number;
}
export declare class IUserFilters {
    page: number;
    size: number;
    email: string;
    phone: string;
    whatsappNumber: string;
    agency_slug: string;
    role: string;
    isSuspended: string;
}
export declare class IModifyUserStatus {
    id: number;
    is2faEnabled: boolean;
    isSuspended: boolean;
    role: role;
}
export declare class IModifyAgentStatus {
    email: string;
    agentStatus: agent_status;
    agencySlug: string;
    role: agent_role;
}
