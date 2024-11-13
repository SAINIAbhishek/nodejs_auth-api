/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and authorization API endpoints
 */

/**
 * @openapi
 * /oauth/login:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user by validating their email and password, and generates access and refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "test1@gmail.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "1234567890"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully, returns access and refresh tokens with user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                   description: The status code indicating success.
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *                   description: The success message.
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           description: The JWT access token
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                         refreshToken:
 *                           type: string
 *                           description: The JWT refresh token
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: The unique user ID.
 *                           example: "66fbc0fe7a573d23e04e79f7"
 *                         email:
 *                           type: string
 *                           description: The user's email.
 *                           example: "test1@gmail.com"
 *                         firstname:
 *                           type: string
 *                           description: The user's first name.
 *                           example: "Update 2"
 *                         lastname:
 *                           type: string
 *                           description: The user's last name.
 *                           example: "Fullstack"
 *                         name:
 *                           type: string
 *                           description: The full name of the user.
 *                           example: "Update 2 Fullstack"
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: The unique role ID.
 *                                 example: "651ec99a91414a6b5efb1680"
 *                               name:
 *                                 type: string
 *                                 description: The role name.
 *                                 example: "USER"
 *                               permissions:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                   description: Permissions granted to the role.
 *                                   example: "VIEW"
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: The role creation date.
 *                                 example: "2024-11-12T09:49:52.712Z"
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: The role last update date.
 *                                 example: "2024-11-12T09:49:52.712Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The user's account creation date.
 *                           example: "2024-10-01T09:29:34.971Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The user's account last update date.
 *                           example: "2024-11-12T10:52:18.638Z"
 *       400:
 *         description: Bad Request (e.g., missing password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                   description: The status code indicating a bad request.
 *                 message:
 *                   type: string
 *                   example: "password is required"
 *                   description: The error message for missing password.
 *       401:
 *         description: Unauthorized (incorrect credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                   description: The status code indicating unauthorized access.
 *                 message:
 *                   type: string
 *                   example: "Your credentials are incorrect"
 *                   description: The error message for invalid credentials.
 *       429:
 *         description: Too Many Requests (rate-limiting exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10004"
 *                   description: The status code indicating rate limit exceeded.
 *                 message:
 *                   type: string
 *                   example: "Too many login attempts, please try again later."
 *                   description: The message explaining the rate-limiting error.
 *
 */

/**
 * @openapi
 * /oauth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by validating input data, checking if the user is already registered, and hashing the password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's first name.
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 description: The user's last name.
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "securePassword123"
 *               terms:
 *                 type: boolean
 *                 description: The user's acceptance of terms and conditions.
 *                 example: true
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - terms
 *     responses:
 *       200:
 *         description: The user has been registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                   description: The status code indicating success.
 *                 message:
 *                   type: string
 *                   example: "The user has been registered successfully"
 *                   description: The success message.
 *                 data:
 *                   type: object
 *                   additionalProperties: false
 *                   description: The empty data object as the registration does not return data.
 *       400:
 *         description: Bad Request - User already registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                   description: The status code indicating a bad request.
 *                 message:
 *                   type: string
 *                   example: "User already registered"
 *                   description: The error message indicating the user already exists.
 */

/**
 * @openapi
 * /oauth/forgotPassword:
 *   post:
 *     summary: Request a password reset email
 *     description: Sends a password reset email to the user if the email exists in the system. The response does not indicate whether the email exists but will notify the user that if it does, they will receive a reset email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address for password reset.
 *                 example: "user@example.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: The password reset email has been sent successfully or will be sent if the email exists in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                   description: The status code indicating success.
 *                 message:
 *                   type: string
 *                   example: "If the email exists you will receive the email to reset the password."
 *                   description: The success message informing the user.
 *                 data:
 *                   type: object
 *                   additionalProperties: false
 *                   description: The empty data object as the email sending does not return additional data.
 *       400:
 *         description: Bad Request - Invalid email format or missing email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                   description: The status code indicating a bad request.
 *                 message:
 *                   type: string
 *                   example: "Invalid email format"
 *                   description: The error message indicating the issue with the provided email.
 *       429:
 *         description: Too many requests - Rate limit exceeded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10004"
 *                   description: The status code indicating too many requests.
 *                 message:
 *                   type: string
 *                   example: "Too many reset password attempts, please try again later."
 *                   description: The error message indicating the rate limit was exceeded.
 */

/**
 * @openapi
 * /oauth/resetPassword/{token}:
 *   patch:
 *     summary: Reset the user's password
 *     description: Resets the user's password using a token and email. The token is provided via the URL and must be valid and not expired. The request body must include the user's new password and email.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The token sent to the user to reset their password.
 *         schema:
 *           type: string
 *           example: "sample-reset-token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "NewPassword123!"
 *               email:
 *                 type: string
 *                 description: The email of the user requesting the password reset.
 *                 example: "user@example.com"
 *             required:
 *               - password
 *               - email
 *     responses:
 *       200:
 *         description: The password has been successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                   description: The status code indicating success.
 *                 message:
 *                   type: string
 *                   example: "The password has been updated successfully"
 *                   description: The success message indicating the password was updated.
 *                 data:
 *                   type: object
 *                   additionalProperties: false
 *                   description: An empty data object as no additional information is needed.
 *       400:
 *         description: Bad Request - Invalid token or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                   description: The status code indicating a bad request.
 *                 message:
 *                   type: string
 *                   example: "Token is invalid or has been expired."
 *                   description: The error message indicating the token is invalid or expired.
 */

/**
 * @openapi
 * /oauth/logout:
 *   post:
 *     summary: Log out the user
 *     description: Logs out the user by clearing the refresh token stored in the cookies.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                   description: The status code indicating success.
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *                   description: The success message indicating that the user has been logged out.
 */

/**
 * @openapi
 * /oauth/refresh:
 *   post:
 *     summary: Refresh access token using the refresh token
 *     description: Refreshes the access token by validating the provided refresh token and issuing a new access token.
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           description: The authorization token (Bearer token).
 *         example: "Bearer {your-refresh-token}"
 *     responses:
 *       200:
 *         description: Token successfully refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                   description: The status code indicating success.
 *                 message:
 *                   type: string
 *                   example: "Token issued"
 *                   description: The success message indicating that a new access token has been issued.
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           description: The newly issued access token.
 *                     user:
 *                       type: object
 *                       description: The sanitized user data.
 *       400:
 *         description: Unauthorized - Invalid or missing refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                   description: The status code indicating an error.
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                   description: The error message indicating an issue with the refresh token.
 */
