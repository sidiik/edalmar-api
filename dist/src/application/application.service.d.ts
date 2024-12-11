import { AgencyService } from 'src/agency/agency.service';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import { ICreateApplication, IListApplications, IUpdateApplication } from './application.dto';
import { ApiResponse } from 'helpers/ApiResponse';
export declare class ApplicationService {
    private prismaService;
    private dbLoggerService;
    private agencyService;
    private logger;
    constructor(prismaService: PrismaService, dbLoggerService: DBLoggerService, agencyService: AgencyService);
    createApplication(data: ICreateApplication, metadata: any): Promise<ApiResponse<{
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
    updateApplication(data: IUpdateApplication, metadata: any): Promise<ApiResponse<{
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
    listApplications(filters: IListApplications, metadata: any): Promise<ApiResponse<{
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
}
