export declare class MessengerService {
    private logger;
    sendWATicketNotification({ phoneNumberId, mediaUrl, travelerName, flightNumber, departure, arrival, date, time, seatNumber, travelerWhatsappNumber, agencyName, agencyWhatsappNumber, agencyPhoneNumber, authToken, }: {
        phoneNumberId: string;
        mediaUrl: string;
        travelerName: string;
        flightNumber: string;
        departure: string;
        arrival: string;
        date: string;
        time: string;
        seatNumber: string;
        travelerWhatsappNumber: string;
        agencyName: string;
        agencyWhatsappNumber: string;
        agencyPhoneNumber: string;
        authToken: string;
    }): Promise<any>;
    sendWAOTPMessage({ phoneNumberId, to, code, authToken, }: {
        phoneNumberId: string;
        to: string;
        code: string;
        authToken: string;
    }): Promise<any>;
}
