/**
 * @openapi
 * components:
 *   schemas:
 *     Email:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the email.
 *           example: "62b8a3a6e3b8c6d2e63a8b1e"
 *         subject:
 *           type: string
 *           description: The subject of the email.
 *           example: "Welcome to Our Service"
 *         to:
 *           type: string
 *           description: The recipient's email address.
 *           example: "user@example.com"
 *         url:
 *           type: string
 *           description: An optional URL related to the email content (e.g., a confirmation link).
 *           example: "https://example.com/verify?token=abc123"
 *         content:
 *           type: string
 *           description: The content of the email.
 *           example: "Thank you for signing up. Please click the link to verify your email."
 *         status:
 *           type: string
 *           enum:
 *             - SENT
 *             - ERROR
 *             - QUEUED
 *           description: The current status of the email.
 *           example: "QUEUED"
 *         error:
 *           type: string
 *           description: A description of any error that occurred when sending the email.
 *           example: "SMTP server not reachable"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the email was created.
 *           example: "2024-11-13T14:07:59.176Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the email was last updated.
 *           example: "2024-11-13T14:07:59.176Z"
 *       required:
 *         - subject
 *         - to
 *         - content
 */
