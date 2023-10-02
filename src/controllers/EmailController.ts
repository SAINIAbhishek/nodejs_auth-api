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

      const message = `The password has been updated successfully. If you did not make this request, please contact your administrator.`;

      const email: Email = {
        to: user.email,
        subject: 'Password update successfully',
        content: message,
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

    const message = `We have received a reset password request. Please use the below link to reset your password. <br><br> <a href="${resetUrl}" target="_blank">Reset password link</a> <br><br> This reset password link will be valid only for 1 hour. <br><br> If you did not make this request, please ignore this mail.`;

    const email: Email = {
      to: user.email,
      subject: 'Password change request received',
      content: message,
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
