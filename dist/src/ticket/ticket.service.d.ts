import { DBLoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';
import { ICreateTicket, IMessageTicket, IRemoveTicket, ITicketListFilters, IUpdateTickets, IUploadTicketMedia, PermenantTicketDelete } from './ticket.dto';
import { ApiResponse } from 'helpers/ApiResponse';
import { AgencyService } from 'src/agency/agency.service';
import { AuthService } from 'src/auth/auth.service';
import * as AWS from 'aws-sdk';
import { MessengerService } from 'src/messenger/messenger.service';
import { ConfigService } from '@nestjs/config';
export declare class TicketService {
    private prismaService;
    private dbLoggerService;
    private agencyService;
    private authService;
    private messengerService;
    private readonly configService;
    private logger;
    private s3;
    constructor(prismaService: PrismaService, dbLoggerService: DBLoggerService, agencyService: AgencyService, authService: AuthService, messengerService: MessengerService, configService: ConfigService);
    onModuleInit(): void;
    createTicket(data: ICreateTicket, metadata: any): Promise<ApiResponse<any>>;
    updateTicket(data: IUpdateTickets, metadata: any): Promise<ApiResponse<any>>;
    removeTicket(data: IRemoveTicket, metadata: any): Promise<ApiResponse<any>>;
    listTickets(filters: ITicketListFilters, metadata: any): Promise<ApiResponse<{
        data: ({
            traveler: {
                id: number;
                whatsapp_number: string;
                phone: string;
                first_name: string;
                last_name: string;
                image_url: string;
            };
            ticket_media: {
                id: number;
                created_at: Date;
                updated_at: Date;
                ticket_id: number;
                media_url: string;
                key: string | null;
            };
        } & {
            id: number;
            created_at: Date;
            updated_at: Date;
            agentId: number | null;
            agencyId: number | null;
            travelerId: number | null;
            ticket_reference: string;
            flight_number: string;
            departure_time: Date;
            arrival_time: Date;
            return_date: Date | null;
            departure_city: string;
            arrival_city: string;
            is_deleted: boolean;
            last_notified: Date | null;
        })[];
        totalCount: number;
        totalPages: number;
        page: number;
        size: number;
    }>>;
    deleteTicket(data: PermenantTicketDelete, metadata: any): Promise<ApiResponse<any>>;
    uploadTicketMedia(file: Express.Multer.File, data: IUploadTicketMedia, metadata: any): Promise<ApiResponse<any>>;
    s3Upload(file: any, name: string, mimetype: string): Promise<AWS.S3.ManagedUpload.SendData>;
    s3DeleteKey(key: string): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>>;
    messageTicket(data: IMessageTicket, metadata: any): Promise<ApiResponse<any>>;
    private keyNameGenerator;
}
