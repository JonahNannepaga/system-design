#!/bin/bash

# Cleanup script for the Username Availability System

# Stop and remove all running containers
docker-compose down

# Remove all unused images
docker image prune -af

# Remove all stopped containers
docker container prune -f

# Remove all unused networks
docker network prune -f

# Remove all unused volumes
docker volume prune -f

echo "Cleanup completed."