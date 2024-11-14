import { booking_status } from '@prisma/client';
export declare enum IncludeBooking {
    traveler = "traveler",
    tickets = "tickets",
    all = "all"
}
export declare class ICreateBooking {
    travelerId: number;
    agencySlug: string;
    bookingDescription: string;
}
export declare class IUpdateBooking {
    bookingId: number;
    travelerId: number;
    bookingStatus: booking_status;
    agencySlug: string;
    bookingDescription: string;
}
export declare class IBookingFilters {
    page: number;
    size: number;
    travelerPhone: string;
    travelerId: string;
    include: IncludeBooking;
    whatsappPhoneNumber: string;
    agencySlug: string;
    startDate: string;
    endDate: string;
}
export declare class ICreateTicket {
    ticket_reference: string;
    booking_id: number;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
    arrivalTime: string;
    seatNumber: string;
    flightNumber: string;
    returnDate: string;
}
export declare class IGetBooking {
    bookingId: number;
    agencySlug: string;
}
