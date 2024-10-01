# Node.js Authentication & Authorization Backend Typescript Project (Learning project)

This project is a scalable, well-structured Node.js backend built with TypeScript. It's designed to handle the complexity and scale of modern applications, while being optimized for different environments.

The codebase follows best practices for Node.js development, with a logical directory structure organized by functionality and type, ensuring maintainability and clarity.

## Features

- **TypeScript:** Enhances development with static typing, leading to more reliable and maintainable code.
- **Request Limiter:** Prevents abuse or overload of routes by limiting request rates, enhancing security.
- **Centralized Error Handling:** Streamlines error management and maintains a consistent user experience.
- **API Versioning:** Organizes routes and ensures compatibility, preventing breaking changes for existing clients.
- **Role-Based Access Control:** Provides fine-grained access management based on user roles.
- **JWT Authentication:** Secures user authentication and authorization using JSON Web Tokens.
- **Password Reset via Email:** Enhances account security and recovery options through email notifications.
- **MongoDB with Mongoose:** Utilizes MongoDB for its speed and scalability, with Mongoose simplifying database interactions.
- **ESLint:** Enforces coding standards and best practices for improved code quality.
- **Prettier:** Formats code consistently according to predefined rules.
- **Cookies for Tokens:** Uses cookies to store tokens securely, improving authentication and session management.
- **Logging:** Utilizes Winston for robust and flexible logging, aiding in debugging and monitoring.
- **Middleware for Exception Handling:** Improves error management within async Express routes.

## Stacks

- Node.js
- Express.js
- Typescript
- Mongoose
- MongoDb
- Joi
- JWT
- Cookies
- Winston
- Rate Limiter
- Roles
- Nodemailer
- Docker image ([API Image](https://hub.docker.com/r/sainiabhishek/nodejs_auth-api))

### Setup MAILTRAP

To test email functionality, use Mailtrap: [Mailtrap](https://mailtrap.io/). Create your credentials and place them in the `.env` file under **Mailtrap (Email Service) Info**.

### How to setup the project

- Clone the repository and navigate to the root directory in your terminal.
- Install the project dependencies by running the following command:

```bash
npm run install:packages
```

- Duplicate the `.env.example` file and save the copy as `.env` in the server directory. Modify the variables as needed.

### How to run the project

- After installing the dependencies, you can either:
  - Go to the `package.json` file and click on the play button next to the `watch` script under the "scripts" section.
  - Or, run the following command in your terminal:

```bash
npm run watch
```

### API Access

```bash
http://localhost:3001/api/v1/
```

### Testing with Postman

You can test the API routes using Postman. Follow these steps:

- Ensure Postman is installed.
- Start the server and verify it's running on the correct port.
- (API Endpoints Documentation - Coming Soon)

### Generating Secret Tokens

- To generate a secret token and refresh token for the `.env` file, open your terminal and run:

```bash
node
```

- Then, in the Node.js REPL:

```bash
require('crypto').randomBytes(64).toString('hex')
```

#### TODO

- Implement session management.
- Complete Postman documentation.
- Improve logging functionality.
- Implement Testing: Add comprehensive unit and integration tests to ensure code reliability and maintainability.
