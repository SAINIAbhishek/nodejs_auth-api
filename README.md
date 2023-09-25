# Node.js Authentication & Authorization Backend Typescript Project

A backend project to handle the scale and complexity of an application. It is design while keeping the different environments in the mind.

> To test the routes and functionality either you can use **POSTMAN** or with the frontend that is another repo on the GitHub: <a href="https://github.com/SAINIAbhishek/react_auth-frontend" target="_blank">React Auth Frontend</a>.

The project structure follows the best practices and conventions of a Node.js application. 

The project has directories based on the functionality and type while justifying the directory name.

Following are the features of this project:
- This backend is written in Typescript: It enhances the development experience by adding static typing to JavaScript, resulting in more reliable and maintainable codebases. It helps catch potential errors during development and provides better code completion and tooling support. 
- Centralised Error handling.
- Centralised Response handling.
- Version system for the routes.
- JSON Web Token(JWT): used to authenticate and authorize users in application. 
- Mongodb is used through Mongoose: Mongodb fits very well to the node.js application. Being NoSQL, fast, and scalable makes it ideal for modern web applications.
- Eslint: As lots of developers work on the same project so to enforces coding standards and best practices in your codebase. We can improve code quality, maintain consistency, catch potential issues early, and enforce coding best practices.
- Prettier: A code formatter to automatically formats code to follow a consistent and predefined set of rules that is in '.prettierrc' configuration file.
- Cookies: Used for storing the refresh token information.
- Winston: For the logging purpose in the application.
- It has middleware for handling exceptions inside of async express routes and passing them to your express error handlers.

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

## How to setup the project

- Clone the project and in the terminal of the root directory run the below cmd to install all the dependencies needed for the project or click on the play button next to it.

```
npm run install:packages
```

- Now clone the file **.env.example** and save a copy as **.env** and change the variables according to your needs.

## How to run the project

After installing the dependencies either you can go to the package.json file and click on the play button on script 'watch' under the scripts object or in the terminal you can write the below cmd or click on the play button next to it.

```
npm run watch
```

## Access the api from

```
http://localhost:3000/api/v1/
```

### Secrets

To generate a secret token and refresh to add in the .env file you can open the terminal and run the below commands

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
- Roles
