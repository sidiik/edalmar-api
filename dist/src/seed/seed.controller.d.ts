import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    seedUsers(): Promise<{
        message: string;
        statusCode: number;
    }>;
    seedAgency(): Promise<404 | {
        message: string;
        statusCode: number;
    }>;
}
