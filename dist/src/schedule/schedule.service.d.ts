import { MessengerService } from 'src/messenger/messenger.service';
import { PrismaService } from 'src/prisma.service';
export declare class ScheduleService {
    private prismaService;
    private messengerService;
    constructor(prismaService: PrismaService, messengerService: MessengerService);
    handleSendMessage(): Promise<void>;
}
