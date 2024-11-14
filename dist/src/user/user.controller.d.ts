import { UserService } from './user.service';
import { ICreateUser, IModifyUserStatus, IUpdateUser, IUserFilters } from './user.dto';
import { Request } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(filters: IUserFilters): Promise<import("../../helpers/ApiResponse").ApiResponse<{
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
    createUser(data: ICreateUser, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    updateUser(data: IUpdateUser, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    ModifyUser(data: IModifyUserStatus, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    listLinkedAgencies(req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
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
}
