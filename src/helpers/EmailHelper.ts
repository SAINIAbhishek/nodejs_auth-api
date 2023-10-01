import nodemailer from 'nodemailer';
import { MAILTRAP_EMAIL } from '../config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

/**
 * used to send test emails during development and testing phases.
 *
 * for sending test emails using the Nodemailer library and a service like
 * Mailtrap for testing email delivery
 * @param options
 */
const testingEmailTransporter = async (
  options: Mail.Options
): Promise<SMTPTransport.SentMessageInfo> => {
  const transporter = nodemailer.createTransport({
    host: MAILTRAP_EMAIL.testing.host,
    port: MAILTRAP_EMAIL.testing.port,
    auth: {
      user: MAILTRAP_EMAIL.testing.username,
      pass: MAILTRAP_EMAIL.testing.password,
    },
  });

  options = {
    ...options,
    from: 'Node.Js Auth Api<support@sai.com>',
  };

  return await transporter.sendMail(options);
};

export default {
  testingEmailTransporter,
};
