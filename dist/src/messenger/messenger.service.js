"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessengerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const ApiException_1 = require("../../helpers/ApiException");
let MessengerService = MessengerService_1 = class MessengerService {
    logger = new common_1.Logger(MessengerService_1.name);
    async sendWATicketNotification({ phoneNumberId, mediaUrl, travelerName, flightNumber, departure, arrival, date, time, seatNumber, travelerWhatsappNumber, agencyName, agencyWhatsappNumber, agencyPhoneNumber, authToken, }) {
        try {
            const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
            const response = await axios_1.default.post(url, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: travelerWhatsappNumber,
                type: 'template',
                template: {
                    name: 'flight_alert',
                    language: {
                        code: 'en',
                    },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                {
                                    type: 'document',
                                    document: {
                                        link: mediaUrl,
                                        filename: `${travelerName}-${flightNumber}.pdf`,
                                    },
                                },
                            ],
                        },
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: travelerName,
                                },
                                {
                                    type: 'text',
                                    text: flightNumber,
                                },
                                {
                                    type: 'text',
                                    text: departure,
                                },
                                {
                                    type: 'text',
                                    text: arrival,
                                },
                                {
                                    type: 'text',
                                    text: date,
                                },
                                {
                                    type: 'text',
                                    text: time,
                                },
                                {
                                    type: 'text',
                                    text: agencyName,
                                },
                                {
                                    type: 'text',
                                    text: agencyWhatsappNumber,
                                },
                                {
                                    type: 'text',
                                    text: agencyPhoneNumber,
                                },
                            ],
                        },
                    ],
                },
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new ApiException_1.ApiException(error.response, error.status);
        }
    }
    async sendWAOTPMessage({ phoneNumberId, to, code, authToken, }) {
        try {
            const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
            const response = await axios_1.default.post(url, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'template',
                template: {
                    name: 'the2facode',
                    language: {
                        code: 'en',
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: code,
                                },
                            ],
                        },
                        {
                            type: 'button',
                            sub_type: 'url',
                            index: 0,
                            parameters: [
                                {
                                    type: 'payload',
                                    payload: code,
                                },
                            ],
                        },
                    ],
                },
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.log('ERROR', JSON.stringify(error));
            this.logger.error(error);
        }
    }
};
exports.MessengerService = MessengerService;
exports.MessengerService = MessengerService = MessengerService_1 = __decorate([
    (0, common_1.Injectable)()
], MessengerService);
//# sourceMappingURL=messenger.service.js.map