import { TicketService } from './ticket.service';
import { ICreateTicket, IMessageTicket, IRemoveTicket, ITicketListFilters, IUpdateTickets, IUploadTicketMedia } from './ticket.dto';
import { Request } from 'express';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    createTicket(data: ICreateTicket, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    updateTicket(data: IUpdateTickets, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    removeTicket(data: IRemoveTicket, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    listTickets(filters: ITicketListFilters, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        data: ({
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
            ticket_reference: string;
            booking_id: number;
            flight_number: string;
            departure_time: Date;
            arrival_time: Date;
            return_date: Date | null;
            departure_city: string;
            arrival_city: string;
            is_deleted: boolean;
        })[];
        totalCount: number;
        totalPages: number;
        page: number;
        size: number;
    }>>;
    uploadTicketFile(file: Express.Multer.File, data: IUploadTicketMedia, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
    sendMessage(data: IMessageTicket, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<any>>;
}
