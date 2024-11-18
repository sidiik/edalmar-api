"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dayjs = require("dayjs");
const messenger_service_1 = require("../messenger/messenger.service");
const prisma_service_1 = require("../prisma.service");
let ScheduleService = class ScheduleService {
    prismaService;
    messengerService;
    constructor(prismaService, messengerService) {
        this.prismaService = prismaService;
        this.messengerService = messengerService;
    }
    async handleSendMessage() {
        const tickets = await this.prismaService.ticket.findMany({
            where: {
                AND: [
                    {
                        booking: {
                            agency: {
                                slug: 'daalo-airlines-travel-agency',
                            },
                        },
                    },
                    {
                        departure_time: {
                            lte: dayjs().add(3, 'day').toDate(),
                        },
                    },
                    {
                        OR: [
                            { last_notified: null },
                            {
                                last_notified: {
                                    lt: dayjs().startOf('day').toDate(),
                                },
                            },
                            {
                                last_notified: {
                                    gt: dayjs().endOf('day').toDate(),
                                },
                            },
                        ],
                    },
                ],
            },
            include: {
                ticket_media: true,
                booking: {
                    include: {
                        traveler: true,
                        agency: true,
                    },
                },
            },
        });
        for (const ticket of tickets) {
            if (ticket.ticket_media.media_url) {
                await this.prismaService.ticket.update({
                    where: {
                        id: ticket.id,
                    },
                    data: {
                        last_notified: dayjs().toDate(),
                    },
                });
                const { booking: { agency, traveler }, } = ticket;
                await this.messengerService.sendWATicketAlert({
                    phoneNumberId: process.env.PHONE_NUMBER_ID,
                    daysLeft: dayjs(ticket.departure_time).diff(dayjs(), 'days'),
                    authToken: process.env.AUTH_TOKEN,
                    agencyName: agency.name,
                    agencyPhoneNumber: agency.phone,
                    agencyWhatsappNumber: agency.phone,
                    arrival: ticket.arrival_city,
                    departure: ticket.departure_city,
                    flightNumber: ticket.flight_number,
                    date: dayjs(ticket.departure_time).format('DD MMM YYYY'),
                    mediaUrl: ticket.ticket_media.media_url,
                    seatNumber: 'N/A',
                    time: dayjs(ticket.departure_time).format('hh:mm A'),
                    travelerName: `${traveler.first_name} ${traveler.last_name}`,
                    travelerWhatsappNumber: traveler.whatsapp_number,
                });
            }
        }
    }
};
exports.ScheduleService = ScheduleService;
__decorate([
    (0, schedule_1.Cron)('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleService.prototype, "handleSendMessage", null);
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        messenger_service_1.MessengerService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map