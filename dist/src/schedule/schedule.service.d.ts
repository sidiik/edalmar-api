import { ConfigService } from '@nestjs/config';
import { MessengerService } from 'src/messenger/messenger.service';
import { PrismaService } from 'src/prisma.service';
export declare class ScheduleService {
    private prismaService;
    private messengerService;
    private readonly configService;
    private logger;
    constructor(prismaService: PrismaService, messengerService: MessengerService, configService: ConfigService);
    handleSendMessage(): Promise<void>;
}
