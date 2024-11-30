import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import config from '../config';

class EmailService {
  /**
   * Sends an email using the configured transporter.
   * @param options The email options including recipient, subject, and content.
   * @returns A promise that resolves with the sent message info.
   */
  public sendEmail = async (options: Mail.Options): Promise<SMTPTransport.SentMessageInfo> => {
    const { mailtrap, server } = config;
    const isProdEnv = server.emailEnv === 'production';
    const emailConfig = isProdEnv ? mailtrap.prod : mailtrap.testing;

    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      auth: {
        user: emailConfig.username,
        pass: emailConfig.password,
      },
    });

    const defaultOptions = {
      from: 'Node.Js Auth Api<support@sai.com>',
      ...options,
    };

    return await transporter.sendMail(defaultOptions);
  };
}

export default new EmailService();
