import { PrismaService } from 'src/prisma.service';
import { ILog } from './logger.dto';
export declare class DBLoggerService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    log(data: ILog): Promise<void>;
}
