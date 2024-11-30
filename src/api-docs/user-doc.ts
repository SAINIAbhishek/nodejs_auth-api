/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           example: "5f8d0d55b54764421b7156c9"
 *         firstname:
 *           type: string
 *           maxLength: 200
 *           example: "John"
 *         lastname:
 *           type: string
 *           maxLength: 200
 *           example: "Doe"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           example: "P@ssw0rd123"
 *         terms:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-13T14:07:59.176Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-13T14:07:59.176Z"
 *         passwordUpdatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-13T15:00:00.000Z"
 *         passwordResetToken:
 *           type: string
 *           example: "hashedToken123"
 *         passwordResetTokenRaw:
 *           type: string
 *           example: "plainToken123"
 *         passwordResetTokenExpires:
 *           type: string
 *           format: date-time
 *           example: "2024-11-14T00:00:00.000Z"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Admin", "User"]
 *
 *     User Register:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *         - terms
 *       properties:
 *         firstname:
 *           type: string
 *           maxLength: 200
 *           example: "John"
 *         lastname:
 *           type: string
 *           maxLength: 200
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 255
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           example: "P@ssw0rd123"
 *         terms:
 *           type: boolean
 *           example: true
 *
 *     User Create:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - password
 *       properties:
 *         firstname:
 *           type: string
 *           maxLength: 200
 *           example: "John"
 *         lastname:
 *           type: string
 *           maxLength: 200
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 255
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           example: "P@ssw0rd123"
 *
 *     User Update:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *           maxLength: 200
 *           example: "John"
 *         lastname:
 *           type: string
 *           maxLength: 200
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 255
 *           example: "john.doe@example.com"
 *
 *     User Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 255
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "P@ssw0rd123"
 *
 *     User Reset Password:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           minLength: 5
 *           maxLength: 255
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           example: "newP@ssw0rd123"
 */

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: API endpoints
 */

/**
 * @openapi
 * /users/:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user in the system with the provided details.
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           description: The authorization token (Bearer token).
 *         example: "Bearer {your-access-token}"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 maxLength: 200
 *                 description: User's first name.
 *               lastname:
 *                 type: string
 *                 maxLength: 200
 *                 description: User's last name.
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 255
 *                 description: User's password.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6734b2bfe24b0b5d293dfa81"
 *                         email:
 *                           type: string
 *                           example: "test5@gmail.com"
 *                         firstname:
 *                           type: string
 *                           example: "Tester 5"
 *                         lastname:
 *                           type: string
 *                           example: "Fullstack"
 *                         name:
 *                           type: string
 *                           example: "Tester 5 Fullstack"
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: []
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-13T14:07:59.176Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-13T14:07:59.176Z"
 *       400:
 *         description: Bad Request - User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10001"
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *   get:
 *     summary: Get all users
 *     description: Fetches all users in the system along with their basic details and roles.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     user:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "66fbc0fe7a573d23e04e79f7"
 *                           email:
 *                             type: string
 *                             example: "test1@gmail.com"
 *                           firstname:
 *                             type: string
 *                             example: "Update 2"
 *                           lastname:
 *                             type: string
 *                             example: "Fullstack"
 *                           name:
 *                             type: string
 *                             example: "Update 2 Fullstack"
 *                           roles:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "651ec99a91414a6b5efb1680"
 *                                 name:
 *                                   type: string
 *                                   example: "USER"
 *                                 permissions:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                   example: ["VIEW"]
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-01T09:29:34.971Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-11-12T10:52:18.638Z"
 */

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                 message:
 *                   type: string
 *                   example: "User fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6734b2bfe24b0b5d293dfa81"
 *                         email:
 *                           type: string
 *                           example: "test5@gmail.com"
 *                         firstname:
 *                           type: string
 *                           example: "Tester"
 *                         lastname:
 *                           type: string
 *                           example: "Fullstack"
 *                         name:
 *                           type: string
 *                           example: "Tester Fullstack"
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: []
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-13T14:07:59.176Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-13T14:07:59.176Z"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10002"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *
 *   put:
 *     summary: Update user by ID
 *     description: Updates a user's information by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: User's updated email address.
 *               firstname:
 *                 type: string
 *                 maxLength: 200
 *                 description: User's updated first name.
 *               lastname:
 *                 type: string
 *                 maxLength: 200
 *                 description: User's updated last name.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6734b2bfe24b0b5d293dfa81"
 *                         email:
 *                           type: string
 *                           example: "test5@gmail.com"
 *                         firstname:
 *                           type: string
 *                           example: "UpdatedTester"
 *                         lastname:
 *                           type: string
 *                           example: "Fullstack"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-13T14:10:59.176Z"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10002"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes a user by their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10000"
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "6734b2bfe24b0b5d293dfa81"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: string
 *                   example: "10002"
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
