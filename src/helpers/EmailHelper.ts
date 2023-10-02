import nodemailer from 'nodemailer';
import { MAILTRAP_EMAIL } from '../config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

/**
 * a template for formatting email content
 * @param firstname
 * @param content
 */
const emailFormatter = (content: string, firstname = '') => {
  return `
    Dear ${firstname}, <br><br>
    ${content} <br><br>
    Thank you for using our service! <br><br>
    Best regards, <br>
    Node.js Auth API
  `;
};

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
  emailFormatter,
};
