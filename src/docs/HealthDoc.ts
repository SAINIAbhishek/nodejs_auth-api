/**
 * @openapi
 * tags:
 *   - name: HealthCheck
 *     description: API endpoint
 */

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     summary: Health check of the application
 *     description: This endpoint returns a message confirming that the API is up and running.
 *     tags: [HealthCheck]
 *     responses:
 *       200:
 *         description: The API is up and running, health check passed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'The API is up and running. Health check is passed.'
 *       500:
 *         description: Internal server error.
 */
