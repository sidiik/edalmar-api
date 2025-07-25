import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ApiException } from 'helpers/ApiException';

@Injectable()
export class MessengerService {
  private logger: Logger = new Logger(MessengerService.name);

  async sendWATicketNotification({
    phoneNumberId,
    mediaUrl,
    travelerName,
    flightNumber,
    departure,
    arrival,
    date,
    time,
    seatNumber,
    travelerWhatsappNumber,
    agencyName,
    agencyWhatsappNumber,
    agencyPhoneNumber,
    authToken,
  }: {
    phoneNumberId: string;
    mediaUrl: string;
    travelerName: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    date: string;
    time: string;
    seatNumber: string;
    travelerWhatsappNumber: string;
    agencyName: string;
    agencyWhatsappNumber: string;
    agencyPhoneNumber: string;
    authToken: string;
  }) {
    try {
      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const response = await axios.post(
        url,
        {
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
                  // {
                  //   type: 'text',
                  //   text: seatNumber,
                  // },
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
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      this.logger.log(`Message sent to ${travelerWhatsappNumber}`);
      this.logger.log(response.data);
    } catch (error) {
      this.logger.log("Failed to send message to traveler's whatsapp");
      this.logger.error(JSON.stringify(error));
    }
  }

  async sendWAOTPMessage({
    phoneNumberId,
    to,
    code,
    authToken,
  }: {
    phoneNumberId: string;
    to: string;
    code: string;
    authToken: string;
  }) {
    try {
      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const response = await axios.post(
        url,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('ERROR', JSON.stringify(error));
      this.logger.error(error);
    }
  }

  async sendWATicketAlert({
    phoneNumberId,
    daysLeft,
    mediaUrl,
    travelerName,
    flightNumber,
    departure,
    arrival,
    date,
    time,
    travelerWhatsappNumber,
    agencyName,
    agencyWhatsappNumber,
    agencyPhoneNumber,
    authToken,
  }: {
    phoneNumberId: string;
    daysLeft: number;
    mediaUrl: string;
    travelerName: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    date: string;
    time: string;
    seatNumber: string;
    travelerWhatsappNumber: string;
    agencyName: string;
    agencyWhatsappNumber: string;
    agencyPhoneNumber: string;
    authToken: string;
  }) {
    try {
      this.logger.log(`Sending message to ${travelerWhatsappNumber}`);
      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const response = await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: travelerWhatsappNumber,
          type: 'template',
          template: {
            name: 'departure_alert',
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
                  {
                    type: 'text',
                    text: daysLeft,
                  },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      this.logger.log(`Message sent to ${travelerWhatsappNumber}`);

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error sending message to ${travelerWhatsappNumber} ` + error,
      );
      throw new ApiException(error.response, error.status);
    }
  }
}
