import { AgencyService } from 'src/agency/agency.service';
import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import { ICreateApplication, IGetApplicationDetails, IListApplications, IUpdateApplication } from './application.dto';
import { ApiResponse } from 'helpers/ApiResponse';
export declare class ApplicationService {
    private prismaService;
    private dbLoggerService;
    private agencyService;
    private logger;
    constructor(prismaService: PrismaService, dbLoggerService: DBLoggerService, agencyService: AgencyService);
    createApplication(data: ICreateApplication, metadata: any): Promise<ApiResponse<{
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
    updateApplication(data: IUpdateApplication, metadata: any): Promise<ApiResponse<{
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
    getApplicationDetails(data: IGetApplicationDetails, metadata: any): Promise<ApiResponse<{
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
}
