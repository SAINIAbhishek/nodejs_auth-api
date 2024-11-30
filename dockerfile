# Stage 1: Build Stage
FROM node:20.17.0-slim AS build

# Display build information
RUN echo "!!!!!! Building node application API image !!!!!!"

# Set the working directory inside the build container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# We are installing the same version that we have in the locally
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Remove unnecessary files after the build
RUN rm -rf \
    node_modules/.bin \
    src \
    *.md \
    .prettierignore \
    .prettierrc \
    tsconfig.json \
    tsconfig.prod.json \
    .eslintrc.json

# Stage 2: Production Stage
FROM node:20.17.0-slim AS production

# Install curl
RUN apt-get update && apt-get install -y curl

# Set the working directory inside the final container
WORKDIR /app

# Copy only the production dependencies and built application from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/.env.example ./.env

# Remove .env.example file
RUN rm -rf .env.example

# Expose the application port
EXPOSE 3001

# Define the command to run your application
CMD [ "npm", "run", "serve" ]