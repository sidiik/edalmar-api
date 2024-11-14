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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const argon2 = require("argon2");
let SeedService = class SeedService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async seedUsers() {
        const users = await this.prismaService.user.count();
        if (users === 0) {
            await this.prismaService.user.create({
                data: {
                    email: 'sidiikpro@gmail.com',
                    firstname: 'Sidiiq',
                    lastname: 'Omar',
                    password: await argon2.hash('argon2'),
                    role: 'admin',
                    phone_number: '252636539685',
                    whatsapp_number: '252636539685',
                    address: 'Hargeisa Somaliland',
                },
            });
            return {
                message: 'Users seeded successfully',
                statusCode: 201,
            };
        }
    }
    async seedAgency() {
        const agency = await this.prismaService.agency.count();
        if (agency === 0) {
            const newAgency = await this.prismaService.agency.create({
                data: {
                    name: 'Shaab Travel Agency',
                    address: 'Hargeisa Somaliland',
                    email: 'sidiikpro@gmail.com',
                    phone: '252636539685',
                },
            });
            await this.prismaService.agency_keys.create({
                data: {
                    agency_id: newAgency.id,
                    twilio_auth_token: 'AC7c20d04ab02f6505e062b9559a5d7513',
                    twilio_sid: '6c079cb221c4fc7536fdeb6f77d5cea1',
                },
            });
            await this.prismaService.agent.create({
                data: {
                    agency: {
                        connect: {
                            id: newAgency.id,
                        },
                    },
                    user: {
                        connect: {
                            email: 'sidiikpro@gmail.com',
                        },
                    },
                },
            });
        }
        return {
            message: 'Agency seeded successfully',
            statusCode: 201,
        };
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeedService);
//# sourceMappingURL=seed.service.js.map