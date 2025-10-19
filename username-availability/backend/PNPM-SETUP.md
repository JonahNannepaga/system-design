# pnpm Workspace Setup

This project has been configured as a pnpm workspace to efficiently manage dependencies across multiple services.

## Quick Start

1. **Install pnpm** (if not already installed):

   ```bash
   npm install -g pnpm
   ```

2. **Run the setup script**:

   ```bash
   ./scripts/pnpm-setup.sh
   ```

3. **Or manually install**:
   ```bash
   pnpm install
   ```

## Workspace Structure

The project is organized as a pnpm workspace with the following packages:

```
username-availability-system/
├── services/
│   ├── api-gateway/          # @username-system/api-gateway
│   ├── username-service/     # @username-system/username-service
│   └── data-seeder/         # @username-system/data-seeder
└── tests/                   # Integration and load tests
```

## Available Commands

### Root Level Commands

```bash
# Install all dependencies
pnpm install

# Build all services
pnpm build:services

# Start all services in development mode
pnpm dev

# Run all tests
pnpm test

# Start Docker infrastructure
pnpm docker:up

# Seed the database
pnpm seed

# Clean all node_modules and dist folders
pnpm clean
```

### Service-Specific Commands

```bash
# Work on specific service
pnpm --filter @username-system/api-gateway dev
pnpm --filter @username-system/username-service build
pnpm --filter @username-system/data-seeder test

# Install dependencies for specific service
pnpm --filter @username-system/api-gateway add express-validator
```

## Benefits of pnpm Workspace

1. **Shared Dependencies**: Common dependencies are hoisted and shared
2. **Fast Installs**: pnpm's symlink-based approach is faster than npm/yarn
3. **Disk Space**: Efficient storage with hard links to global store
4. **Type Safety**: Better TypeScript support across packages
5. **Monorepo Management**: Easy cross-package development

## Development Workflow

1. **Start infrastructure**:

   ```bash
   pnpm docker:up
   ```

2. **Seed database**:

   ```bash
   pnpm seed
   ```

3. **Start development servers**:

   ```bash
   pnpm dev
   ```

4. **Run tests**:
   ```bash
   pnpm test
   ```

## Package Dependencies

Each service has been updated with modern dependency versions:

- **Node.js**: >=18.0.0
- **TypeScript**: ^5.2.2
- **Express**: ^4.18.2
- **Redis**: ^4.6.8 (updated from v3)
- **PostgreSQL**: ^8.11.3

## Troubleshooting

### Clean Install

```bash
pnpm clean
pnpm install
```

### Rebuild All

```bash
pnpm build:services
```

### Check Workspace

```bash
pnpm list --depth=0
```
