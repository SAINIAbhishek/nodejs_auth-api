import asyncHandler from 'express-async-handler';
import { EmailModel } from '../models/email-model';
import { BadRequestError, InternalError } from '../services/error-service';
import { Email, EmailStatusEnum } from '../types/email-type';
import { Request, Response } from 'express';
import { emailPreparePasswordUpdate, emailPrepareReset } from '../helpers/email-helper';
import EmailService from '../services/email-service';
import { User } from '../types/user-type';
import logger from '../middleware/logging-handler';
import UserModel from '../models/user-model';
import { SuccessMsgResponse, SuccessResponse } from '../services/response-service';

class EmailController {
  /**
   * Handles the password update process by sending a update update email to the user.
   */
  passwordUpdateSuccessfully = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const isPasswordUpdated = req.resetPassword.isPasswordUpdated;

    if (!isPasswordUpdated || !user?.id) {
      throw new BadRequestError(
        'There was an error while resetting password. Please try again later.'
      );
    }

    const email: Email = emailPreparePasswordUpdate(user.email, user.firstname);

    try {
      await EmailService.sendEmail({
        to: email.to,
        subject: email.subject,
        html: email.content,
      });
      email.status = EmailStatusEnum.SENT;
    } catch (err: unknown) {
      email.status = EmailStatusEnum.ERROR;

      email.error =
        err instanceof Error
          ? err.message
          : 'Nodemailer error while sending the password update mail.';

      logger.error(err);
    }

    await EmailModel.create(email);

    new SuccessMsgResponse('The password has been updated successfully').send(res);
  });

  /**
   * Handles the password reset process by sending a reset email to the user.
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new BadRequestError(
        'There was an error while resetting password. Please try again later.'
      );
    }

    const passwordResetTokenRaw = user.passwordResetTokenRaw;
    if (!passwordResetTokenRaw) {
      throw new BadRequestError(
        'There was an error while resetting password. Please try again later.'
      );
    }

    const email: Email = emailPrepareReset(user.email, user.firstname, passwordResetTokenRaw);

    try {
      await EmailService.sendEmail({
        to: email.to,
        subject: email.subject,
        html: email.content,
      });
      email.status = EmailStatusEnum.SENT;
    } catch (err: unknown) {
      email.status = EmailStatusEnum.ERROR;

      email.error =
        err instanceof Error
          ? err.message
          : 'Nodemailer error while sending the password reset mail.';

      logger.error(err);

      const updateFields: User = {
        passwordResetToken: undefined,
        passwordResetTokenRaw: undefined,
        passwordResetTokenExpires: undefined,
      };

      await UserModel.findOneAndUpdate({ _id: user.id }, { $set: updateFields }).lean().exec();
    }

    await EmailModel.create(email);

    if (email.status === EmailStatusEnum.ERROR) {
      throw new InternalError(
        'There was an error while sending the reset password email. Please try again later.'
      );
    }

    new SuccessResponse('The password reset email has been sent successfully', {
      passwordResetToken: user.passwordResetTokenRaw,
    }).send(res);
  });
}

export default new EmailController();
