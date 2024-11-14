import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import { ICreateUser, IModifyUserStatus, IUpdateUser, IUserFilters } from './user.dto';
import { ApiResponse } from 'helpers/ApiResponse';
import { Cache } from '@nestjs/cache-manager';
export declare class UserService {
    private readonly prismaService;
    private readonly dbLoggerService;
    private cacheManager;
    private readonly logger;
    constructor(prismaService: PrismaService, dbLoggerService: DBLoggerService, cacheManager: Cache);
    getAllUsers(filters: IUserFilters): Promise<ApiResponse<{
        data: {
            id: number;
            firstname: string;
            lastname: string;
            first_login: boolean;
            profile_url: string;
            email: string;
            phone_number: string;
            whatsapp_number: string;
            created_at: Date;
            updated_at: Date;
            role: import(".prisma/client").$Enums.role;
        }[];
        page: number;
        size: number;
        totalCount: number;
    }>>;
    createUser(data: ICreateUser, metadata: any): Promise<ApiResponse<any>>;
    updateUser(data: IUpdateUser, metadata: any): Promise<ApiResponse<any>>;
    listMyLinkedAgencies(metadata: any): Promise<ApiResponse<{
        data: {
            name: string;
            id: number;
            address: string;
            agent: {
                role: import(".prisma/client").$Enums.agent_role;
                agent_status: import(".prisma/client").$Enums.agent_status;
                start_hour: number;
                end_hour: number;
            }[];
            slug: string;
            logo_url: string;
            phone: string;
        }[];
    }>>;
    modifyUserStatus(data: IModifyUserStatus, metadata: any): Promise<ApiResponse<any>>;
}
