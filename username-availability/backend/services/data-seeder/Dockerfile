FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN pnpm build

# Command to run the seeder
CMD ["pnpm", "start"]