import { BookingService } from './booking.service';
import { IBookingFilters, ICreateBooking, IGetBooking, IUpdateBooking } from './booking.dto';
import { Request } from 'express';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(data: ICreateBooking, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        id: number;
        created_at: Date;
        updated_at: Date;
        agency_id: number;
        booking_description: string | null;
        traveler_id: number;
        agent_id: number;
        booking_status: import(".prisma/client").$Enums.booking_status;
    }>>;
    updateBooking(data: IUpdateBooking, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        id: number;
        created_at: Date;
        updated_at: Date;
        agency_id: number;
        booking_description: string | null;
        traveler_id: number;
        agent_id: number;
        booking_status: import(".prisma/client").$Enums.booking_status;
    }>>;
    listBookings(filters: IBookingFilters, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        data: ({
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
            _count: {
                tickets: number;
            };
            tickets: {
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
                last_notified: Date | null;
            }[];
        } & {
            id: number;
            created_at: Date;
            updated_at: Date;
            agency_id: number;
            booking_description: string | null;
            traveler_id: number;
            agent_id: number;
            booking_status: import(".prisma/client").$Enums.booking_status;
        })[];
        totalCount: number;
        totalPages: number;
        page: number;
        size: number;
    }>>;
    getBookingDetails(filters: IGetBooking, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        agent: {
            user: {
                id: number;
                firstname: string;
                lastname: string;
                email: string;
                phone_number: string;
                whatsapp_number: string;
            };
            id: number;
            agent_status: import(".prisma/client").$Enums.agent_status;
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
        tickets: ({
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
            last_notified: Date | null;
        })[];
    } & {
        id: number;
        created_at: Date;
        updated_at: Date;
        agency_id: number;
        booking_description: string | null;
        traveler_id: number;
        agent_id: number;
        booking_status: import(".prisma/client").$Enums.booking_status;
    }>>;
}
