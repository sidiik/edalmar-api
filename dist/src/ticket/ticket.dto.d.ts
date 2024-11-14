export declare class ICreateTicketItem {
    ticketReference: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureCity: string;
    arrivalCity: string;
    returnDate: string;
}
export declare class IUpdateTicketItem {
    ticketId: number;
    ticketReference: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureCity: string;
    arrivalCity: string;
    returnDate: string;
}
export declare class ICreateTicket {
    tickets: ICreateTicketItem[];
    agencySlug: string;
    bookingId: number;
}
export declare class IUpdateTickets {
    tickets: IUpdateTicketItem[];
    agencySlug: string;
    bookingId: number;
}
export declare class IRemoveTicket {
    ticketId: number;
    moveToRecycleBin: boolean;
    restoreFromRecycleBin: boolean;
    agencySlug: string;
}
export declare class ITicketListFilters {
    agencySlug: string;
    bookingId: string;
    isDeleted: string;
    page: number;
    size: number;
}
export declare class PermenantTicketDelete {
    ticketId: number;
    agencySlug: string;
    code: string;
}
export declare class IUploadTicketMedia {
    ticketId: string;
    agencySlug: string;
}
export declare class IMessageTicket {
    ticketId: number;
    agencySlug: string;
}
