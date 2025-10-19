#!/bin/bash

# Build Docker images for all services
docker-compose build

# Start all services in detached mode
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Seed the database with test usernames
docker-compose run data-seeder

# Display the status of the services
docker-compose ps

echo "Setup complete. Services are running."