# Node.js Authentication & Authorization Backend Typescript Project

A scalable and well-structured Node.js backend project designed to handle the scale and complexity of an application. It is designed while taking into consideration the different environments.

The project structure follows the best practices and conventions of a Node.js application.

The project has directories organized based on functionality and type, with directory names chosen to reflect their purpose.

Following are the features of this project:
- This backend is written in TypeScript, enhancing the development experience by adding static typing to JavaScript. This results in more reliable and maintainable codebases, helps catch potential errors during development, and provides better code completion and tooling support.
- It includes a limiter to restrict excessive requests to the login route, preventing abuse or overload.
- It features centralized error handling and response management, streamlining the codebase for easier maintenance and consistent user experience.
- The project implements a versioning system for its routes, ensuring better organization and compatibility when evolving the API.
- Role-based access control is implemented to grant or restrict permissions based on user roles, enhancing security and access management.
- JSON Web Token (JWT) is used for user authentication and authorization, adding a layer of security to the application.
- MongoDB is utilized through Mongoose, offering a NoSQL database solution that is fast and scalable, making it well-suited for modern web applications.
- ESLint enforces coding standards and best practices in the codebase, improving code quality, maintaining consistency, identifying potential issues early, and enforcing coding best practices.
- Prettier, a code formatter, automatically formats code to adhere to a consistent and predefined set of rules specified in the '.prettierrc' configuration file.
- Cookies are employed to store refresh token information, enhancing user authentication and session management.
- Winston is used for logging purposes within the application, providing a robust and flexible logging solution.
- The project includes middleware for handling exceptions within async Express routes and forwarding them to Express error handlers, improving error management and ensuring smooth operation.

## Stacks:
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

## How to setup the project

- Clone the project and, in the terminal, navigate to the root directory. Then, run the following command to install all the dependencies needed for the project
- Alternatively, you can click on the play button next to it to automatically install all the required dependencies for the project.

```
npm run install:packages
```

- Duplicate the **.env.example** file and rename the copy to **.env**. Modify the variables as needed.

## How to run the project

- After installing the dependencies, you can go to the package.json file and click on the play button next to the 'watch' script under the scripts object.
- Alternatively, in the terminal, you can execute the following command:

```
npm run watch
```

## Access the API at

```
http://localhost:3000/api/v1/
```

## Testing the Routes and Functionality

To test the routes and functionality of this API either you can use tool like **POSTMAN** or you can use the frontend that is another repo on the GitHub (still in developing phase): <a href="https://github.com/SAINIAbhishek/react_auth-frontend" target="_blank">React Auth Frontend</a>.)

### As for testing this backend API using Postman:
- Install Postman if you haven't already.
- Start the backend server, making sure it's running on the correct port.
- (Need to be configured) <a href="" target="_blank">API Endpoints Documentation</a>

### As for integrating the frontend with the backend, you can follow these general steps:
- Ensure that your backend server is running and accessible.
- Clone the frontend repository from GitHub to your local machine.
- Please refer to the specific README file of the frontend repository for any additional instructions or configuration details

### Secrets

To generate a secret token and refresh token to add to the **.env** file, you can open the terminal and execute the following commands

```
node
```
```
require('crypto').randomBytes(64).toString('hex')
```

<hr>

#### TODO
- Forget Password
- Remember Me
- Session Management
- Postman documentation
