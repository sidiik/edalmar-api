import { Injectable } from '@nestjs/common';
import { ApiException } from 'helpers/ApiException';
import * as Twilio from 'twilio';

@Injectable()
export class MessengerService {
  async sendWaMessage(
    from: string,
    to: string,
    body: string,
    agencyName: string,
    sid: string,
    authToken: string,
    mediaUrl?: string[],
  ) {
    const client = Twilio(sid, authToken);
    try {
      const message = await client.messages.create({
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`,
        body:
          body +
          `\n*${agencyName}*` +
          '\n' +
          '```Powered by Shaab Solutions```',
        mediaUrl,
      });

      return message;
    } catch (error) {
      console.log(error);
      throw new ApiException(`Failed to send message`);
    }
  }
}
