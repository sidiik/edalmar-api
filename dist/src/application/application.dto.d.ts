import { application_status, application_type } from '@prisma/client';
export declare enum ApplicationPriority {
    'all' = "all",
    'overdue' = "overdue",
    'urgent' = "urgent",
    'normal' = "normal",
    'low' = "low"
}
export declare enum ApplicationType {
    'all' = "all",
    'visa' = "visa",
    'passport' = "passport",
    'certificate' = "certificate"
}
export declare enum ApplicationStatus {
    'all' = "all",
    'pending' = "pending",
    'approved' = "approved",
    'rejected' = "rejected"
}
export declare class ICreateApplication {
    note: string;
    applicationReference: string;
    metadata: string;
    applicationType: application_type;
    applicationStatus: application_status;
    agencySlug: string;
    travelerId: number;
    notificationDue: string;
}
export declare class IUpdateApplication {
    applicationId: number;
    note: string;
    applicationReference: string;
    metadata: string;
    applicationType: application_type;
    applicationStatus: application_status;
    agencySlug: string;
    travelerId: number;
    notificationDue: string;
}
export declare class IListApplications {
    agencySlug: string;
    travelerId: string;
    applicationStatus: ApplicationStatus;
    travelerPhone: string;
    whatsappNumber: string;
    applicationType: ApplicationType;
    page: number;
    size: number;
    startDate: string;
    endDate: string;
    priority: ApplicationPriority;
}
