import { ApplicationService } from './application.service';
import { ICreateApplication, IListApplications, IUpdateApplication } from './application.dto';
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
            note: string | null;
            application_ref: string;
            application_status: import(".prisma/client").$Enums.application_status;
            metadata: string;
            application_type: import(".prisma/client").$Enums.application_type;
            created_at: Date;
            updated_at: Date;
            traveler_id: number | null;
            agency_id: number;
            agent_id: number;
            due: Date;
        })[];
        totalCount: number;
        totalPages: number;
        page: number;
        size: number;
    }>>;
    createApplication(data: ICreateApplication, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        id: number;
        note: string | null;
        application_ref: string;
        application_status: import(".prisma/client").$Enums.application_status;
        metadata: string;
        application_type: import(".prisma/client").$Enums.application_type;
        created_at: Date;
        updated_at: Date;
        traveler_id: number | null;
        agency_id: number;
        agent_id: number;
        due: Date;
    }>>;
    updateApplication(data: IUpdateApplication, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        id: number;
        note: string | null;
        application_ref: string;
        application_status: import(".prisma/client").$Enums.application_status;
        metadata: string;
        application_type: import(".prisma/client").$Enums.application_type;
        created_at: Date;
        updated_at: Date;
        traveler_id: number | null;
        agency_id: number;
        agent_id: number;
        due: Date;
    }>>;
}
