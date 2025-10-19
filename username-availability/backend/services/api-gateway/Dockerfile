FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy the source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN pnpm build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start"]