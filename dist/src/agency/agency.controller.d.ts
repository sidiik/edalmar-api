import { ICreateAgency, ILinkAgent, IListAgencyFilters, IResetAgentPassword, IUpdateAgency, IUpdateAgencyKeys } from './agency.dto';
import { AgencyService } from './agency.service';
import { Request } from 'express';
import { IModifyAgentStatus } from 'src/user/user.dto';
export declare class AgencyController {
    private readonly agencyService;
    constructor(agencyService: AgencyService);
    createAgency(data: ICreateAgency, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        name: string;
        id: number;
        address: string;
        email: string;
        created_at: Date;
        updated_at: Date;
        slug: string | null;
        agency_disabled: boolean;
        logo_url: string | null;
        phone: string;
        user_lock_minutes: number | null;
        user_login_attempts: number | null;
        account_lock_enabled: boolean;
        max_agents: number | null;
    }>>;
    updateAgency(data: IUpdateAgency, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        name: string;
        id: number;
        address: string;
        email: string;
        created_at: Date;
        updated_at: Date;
        slug: string | null;
        agency_disabled: boolean;
        logo_url: string | null;
        phone: string;
        user_lock_minutes: number | null;
        user_login_attempts: number | null;
        account_lock_enabled: boolean;
        max_agents: number | null;
    }>>;
    updateAgencyKeys(data: IUpdateAgencyKeys, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    linkAgent(data: ILinkAgent, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    listAgents(agencySlug: string, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<({
        user: {
            id: number;
            firstname: string;
            lastname: string;
            profile_url: string;
            is_2fa_enabled: boolean;
            is_suspended: boolean;
            address: string;
            email: string;
            phone_number: string;
            whatsapp_number: string;
            role: import(".prisma/client").$Enums.role;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        role: import(".prisma/client").$Enums.agent_role;
        user_id: number;
        agency_id: number;
        agent_status: import(".prisma/client").$Enums.agent_status;
        start_hour: number | null;
        end_hour: number | null;
    })[]>>;
    modifyAgentStatus(data: IModifyAgentStatus, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    resetAgentPassword(data: IResetAgentPassword, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    listAgencies(filters: IListAgencyFilters): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        data: {
            name: string;
            id: number;
            address: string;
            email: string;
            created_at: Date;
            updated_at: Date;
            slug: string | null;
            agency_disabled: boolean;
            logo_url: string | null;
            phone: string;
            user_lock_minutes: number | null;
            user_login_attempts: number | null;
            account_lock_enabled: boolean;
            max_agents: number | null;
        }[];
        totalCount: number;
        totalPages: number;
        page: number;
        size: number;
    }>>;
}
