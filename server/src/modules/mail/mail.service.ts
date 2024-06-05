import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      templateId: 'd-52d76971b1214cc69badd0ddf21082fc',
      dynamic_template_data: {
        reset_password_url: `http://your-frontend-url/reset-password?token=${token}`,
      },
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending reset password email', error);
    }
  }
}
