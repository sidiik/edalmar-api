import { TravelerService } from './traveler.service';
import { ICreateTraveler, IGetTraveler, IListTravelersFilters, IUpdateTraveler } from './traveler.dto';
import { Request } from 'express';
export declare class TravelerController {
    private readonly travelerService;
    constructor(travelerService: TravelerService);
    createTraveler(data: ICreateTraveler, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
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
    }>>;
    updateTraveler(data: IUpdateTraveler, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
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
    }>>;
    listTravelers(data: IListTravelersFilters, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
        data: {
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
        }[];
        totalCount: number;
        page: number;
        size: number;
        totalPages: number;
    }>>;
    getTraveler(data: IGetTraveler, req: Request): Promise<import("../../helpers/ApiResponse").ApiResponse<{
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
    }>>;
}
