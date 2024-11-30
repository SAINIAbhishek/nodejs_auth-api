/**
 * @openapi
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the role.
 *           example: "62b8a3a6e3b8c6d2e63a8b1f"
 *         name:
 *           type: string
 *           enum:
 *             - USER
 *             - ADMIN
 *             - MANAGER
 *           description: The name of the role.
 *           example: "ADMIN"
 *         description:
 *           type: string
 *           description: A description of the role.
 *           example: "Administrator with full permissions"
 *         status:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *           description: The status of the role.
 *           example: "ACTIVE"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - EDIT
 *               - VIEW
 *               - DELETE
 *               - SHARE
 *               - UPDATE
 *           description: The permissions associated with the role.
 *           example: ["VIEW", "EDIT"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the role was created.
 *           example: "2024-11-13T14:07:59.176Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the role was last updated.
 *           example: "2024-11-13T14:07:59.176Z"
 */
