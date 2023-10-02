import asyncHandler from 'express-async-handler';
import { ProtectedRequest } from 'app-request';
import { API_VERSION } from '../config';
import EmailHelper from '../helpers/EmailHelper';
import User, { UserModel } from '../models/UserModel';
import { BadRequestError, InternalError } from '../middleware/ApiError';
import Email, { EmailModel, EmailStatusEnum } from '../models/EmailModel';
import { SuccessResponse } from '../middleware/ApiResponse';
import Logger from '../middleware/Logger';

class EmailController {
  passwordUpdateSuccessfully = asyncHandler(
    async (req: ProtectedRequest, res) => {
      const { isPasswordUpdated, user } = req.email;

      if (!isPasswordUpdated || !user) {
        throw new BadRequestError(
          'There was an error while resetting password. Please try again later.'
        );
      }

      const message =
        'Your password has been successfully updated. If you did not initiate this change, please contact your administrator for assistance.';

      const email: Email = {
        to: user.email,
        subject: 'Password update successfully',
        content: EmailHelper.emailFormatter(message, user.firstname),
      };

      try {
        await EmailHelper.testingEmailTransporter({
          to: email.to,
          subject: email.subject,
          html: email.content,
        });

        email.status = EmailStatusEnum.SENT;
      } catch (err: any) {
        email.error = err?.message;
        email.status = EmailStatusEnum.ERROR;

        Logger.error(err);
      }

      await EmailModel.create(email);

      new SuccessResponse(
        'The password has been updated successfully',
        {}
      ).send(res);
    }
  );

  resetPassword = asyncHandler(async (req: ProtectedRequest, res) => {
    const { user } = req.email;
    if (!user) throw new BadRequestError('User is required');

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/${API_VERSION}/oauth/resetPassword/${
      user.passwordResetTokenRaw
    }?email=${user.email}`;

    const message = `
        We've received a request to reset your password. Don't worry, we've got you covered! <br><br>
        To reset your password, simply click on the button below: <br><br>
        <a href="${resetUrl}" target="_blank">
          <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Reset Password
          </button>
        </a> <br><br>
        If you're having trouble with the button, you can also copy and paste this link into your browser's address bar: <br><br>
        ${resetUrl} <br><br>
        This password reset link will expire in 1 hour, so please reset your password promptly. <br><br>
        If you didn't initiate this request or have any concerns, please ignore this message. Your account remains secure.`;

    const email: Email = {
      to: user.email,
      subject: 'Password change request received',
      content: EmailHelper.emailFormatter(message, user.firstname),
      url: resetUrl,
    };

    try {
      await EmailHelper.testingEmailTransporter({
        to: email.to,
        subject: email.subject,
        html: email.content,
      });

      email.status = EmailStatusEnum.SENT;
    } catch (err: any) {
      const updateFields: User = {
        passwordResetToken: undefined,
        passwordResetTokenRaw: undefined,
        passwordResetTokenExpires: undefined,
      };

      email.error = err?.message;
      email.status = EmailStatusEnum.ERROR;

      Logger.error(err);

      await UserModel.findOneAndUpdate(
        { _id: user._id },
        { $set: updateFields }
      );
    }

    await EmailModel.create(email);

    if (email.status === EmailStatusEnum.ERROR) {
      throw new InternalError(
        'There was an error while sending the reset password email. Please try again later.'
      );
    }

    new SuccessResponse(
      'The password reset email has been sent successfully',
      {}
    ).send(res);
  });
}

export default new EmailController();
