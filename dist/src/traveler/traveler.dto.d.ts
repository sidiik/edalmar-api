export declare class ICreateTraveler {
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    dob: string;
    agencySlug: string;
    nationality: string;
    notificationsEnabled: boolean;
}
export declare class IUpdateTraveler {
    firstname: string;
    lastname: string;
    address: string;
    email: string;
    phone: string;
    whatsappNumber: string;
    dob: string;
    agencySlug: string;
    nationality: string;
    notificationsEnabled: boolean;
    travelerId: number;
}
export declare class IListTravelersFilters {
    agencySlug: string;
    page: number;
    size: number;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    whatsappNumber: string;
    startDate: string;
    endDate: string;
}
export declare class IGetTraveler {
    travelerId: string;
    agencySlug: string;
}
