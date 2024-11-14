import { PrismaService } from 'src/prisma.service';
export declare class SeedService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    seedUsers(): Promise<{
        message: string;
        statusCode: number;
    }>;
    seedAgency(): Promise<{
        message: string;
        statusCode: number;
    }>;
}
