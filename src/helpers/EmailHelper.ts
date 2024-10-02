import nodemailer from 'nodemailer';
import { MAILTRAP_EMAIL, MAILTRAP_EMAIL_ENV } from '../config';
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
  * used to send emails.
 *
 * for sending test emails using the Nodemailer library and a service like
 * Mailtrap for email delivery
 * @param options 
 * @returns 
 */
const emailTransporter = async (
  options: Mail.Options,
): Promise<SMTPTransport.SentMessageInfo> => {
  const isProdEnv = MAILTRAP_EMAIL_ENV === "production";

  const transporter = nodemailer.createTransport({
    host: isProdEnv ? MAILTRAP_EMAIL.prod.host : MAILTRAP_EMAIL.testing.host,
    port: isProdEnv ? MAILTRAP_EMAIL.prod.port : MAILTRAP_EMAIL.testing.port,
    auth: {
      user: isProdEnv ? MAILTRAP_EMAIL.prod.username : MAILTRAP_EMAIL.testing.username,
      pass: isProdEnv ? MAILTRAP_EMAIL.prod.password : MAILTRAP_EMAIL.testing.password,
    },
  });

  options = {
    ...options,
    from: 'Node.Js Auth Api<support@sai.com>',
  };

  return await transporter.sendMail(options);
};

export default {
  emailFormatter,
  emailTransporter
};
