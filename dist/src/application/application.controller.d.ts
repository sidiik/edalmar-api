import { ApplicationService } from './application.service';
import { ICreateApplication, IGetApplicationDetails, IListApplications, IUpdateApplication } from './application.dto';
import { Request } from 'express';
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    listApplications(data: IListApplications, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        data: ({
            traveler: {
                id: number;
                whatsapp_number: string;
                phone: string;
                first_name: string;
                last_name: string;
            };
        } & {
            id: number;
            created_at: Date;
            updated_at: Date;
            agency_id: number;
            note: string | null;
            metadata: string;
            application_ref: string;
            application_status: import(".prisma/client").$Enums.application_status;
            application_type: import(".prisma/client").$Enums.application_type;
            traveler_id: number | null;
            agent_id: number;
            due: Date;
        })[];
        totalCount: number;
        totalPages: number;
        page: number;
        size: number;
    }>>;
    applicationDetails(data: IGetApplicationDetails, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        agent: {
            user: {
                id: number;
                firstname: string;
                lastname: string;
                phone_number: string;
                whatsapp_number: string;
            };
            id: number;
            role: import(".prisma/client").$Enums.agent_role;
        };
        traveler: {
            id: number;
            address: string;
            email: string | null;
            whatsapp_number: string;
            created_at: Date;
            updated_at: Date;
            phone: string;
            agency_id: number;
            dob: Date | null;
            nationality: string;
            first_name: string;
            last_name: string;
            image_url: string | null;
            notifications_enabled: boolean;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        agency_id: number;
        note: string | null;
        metadata: string;
        application_ref: string;
        application_status: import(".prisma/client").$Enums.application_status;
        application_type: import(".prisma/client").$Enums.application_type;
        traveler_id: number | null;
        agent_id: number;
        due: Date;
    }>>;
    createApplication(data: ICreateApplication, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        id: number;
        created_at: Date;
        updated_at: Date;
        agency_id: number;
        note: string | null;
        metadata: string;
        application_ref: string;
        application_status: import(".prisma/client").$Enums.application_status;
        application_type: import(".prisma/client").$Enums.application_type;
        traveler_id: number | null;
        agent_id: number;
        due: Date;
    }>>;
    updateApplication(data: IUpdateApplication, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        id: number;
        created_at: Date;
        updated_at: Date;
        agency_id: number;
        note: string | null;
        metadata: string;
        application_ref: string;
        application_status: import(".prisma/client").$Enums.application_status;
        application_type: import(".prisma/client").$Enums.application_type;
        traveler_id: number | null;
        agent_id: number;
        due: Date;
    }>>;
}
