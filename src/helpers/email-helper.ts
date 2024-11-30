import config from '../config';
import { Email } from '../types/email-type';

/**
 * Formats the email content with a personalized greeting and a message body.
 * @param content - The main body content of the email.
 * @param firstname - The recipient's first name for personalization.
 * @returns A formatted email string.
 */
const emailFormatter = (content: string, firstname: string): string => `
    Dear ${firstname}, <br><br>
    ${content} <br><br>
    Thank you for using our service! <br><br>
    Best regards, <br>
    Node.js Auth API
`;

/**
 * Constructs the password reset URL using the provided email and token.
 * @param email - The user's email address.
 * @param passwordResetTokenRaw - The raw password reset token.
 * @returns The complete password reset URL.
 */
const emailResetUrl = (email: string, passwordResetTokenRaw: string): string => {
  return `${config.frontend.resetUrl}auth/reset-password/${passwordResetTokenRaw}?email=${email}`;
};

/**
 * Generates the HTML content for a password reset email.
 * @param resetUrl - The password reset URL to include in the email.
 * @returns A string containing the password reset instructions and button.
 */
const emailResetMessage = (resetUrl: string): string => {
  return `
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
};

/**
 * Prepares an email object for sending a password reset email.
 * @param email - The recipient's email address.
 * @param firstname - The recipient's first name.
 * @param passwordResetTokenRaw - The raw password reset token.
 * @returns An `Email` object containing the reset email details.
 */
export const emailPrepareReset = (
  email: string,
  firstname: string,
  passwordResetTokenRaw: string
): Email => {
  const resetUrl = emailResetUrl(email, passwordResetTokenRaw);
  const message = emailResetMessage(resetUrl);
  const content = emailFormatter(message, firstname);

  return {
    to: email,
    subject: 'Password change request received',
    content: content,
    url: resetUrl,
  };
};

/**
 * Prepares an email object for notifying the user about a successful password update.
 * @param email - The recipient's email address.
 * @param firstname - The recipient's first name.
 * @returns An `Email` object containing the password update confirmation details.
 */
export const emailPreparePasswordUpdate = (email: string, firstname: string): Email => {
  const message =
    'Your password has been successfully updated. If you did not initiate this change, please contact your administrator for assistance.';

  return {
    to: email,
    subject: 'Password update successfully',
    content: emailFormatter(message, firstname),
  };
};
