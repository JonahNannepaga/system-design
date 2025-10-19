# Username Availability System

This project implements a scalable system to check username availability, designed to handle billions of users efficiently. The architecture leverages Docker for local development, allowing for easy setup and management of services.

## Project Structure

```
username-availability-system
├── docker-compose.yml          # Orchestrates services
├── services                    # Contains microservices
│   ├── api-gateway             # API Gateway service
│   ├── username-service         # Username management service
│   └── data-seeder             # Service to seed test data
├── infrastructure               # Infrastructure components
│   ├── postgres                 # PostgreSQL setup
│   ├── redis                    # Redis setup
│   └── nginx                    # NGINX reverse proxy
├── monitoring                   # Monitoring setup
│   ├── prometheus               # Prometheus configuration
│   └── grafana                  # Grafana dashboards
├── scripts                      # Utility scripts
│   ├── setup.sh                 # Setup script
│   ├── test-load.sh             # Load testing script
│   └── cleanup.sh               # Cleanup script
├── tests                        # Test cases
│   ├── integration              # Integration tests
│   └── load                     # Load tests
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Local Development Setup

1. **Docker**: Ensure Docker is installed on your machine.
2. **Clone the Repository**: Clone this repository to your local machine.
3. **Build and Start Services**: Run the following command to build and start all services:
   ```bash
   docker-compose up --build
   ```
4. **Access the API**: The API Gateway will be accessible at `http://localhost:3000`.

## Services Overview

- **API Gateway**: Handles incoming requests and routes them to the appropriate services.
- **Username Service**: Manages username availability checks, registrations, and suggestions.
- **Data Seeder**: Seeds the database with test usernames for development and testing.
- **PostgreSQL**: Stores usernames and related data.
- **Redis**: Caches username availability for fast lookups.
- **NGINX**: Acts as a reverse proxy for the API Gateway.

## Testing

- **Integration Tests**: Located in the `tests/integration` directory, these tests validate the username availability flow.
- **Load Tests**: Located in the `tests/load` directory, these tests assess the system's performance under load.

## Monitoring

- **Prometheus**: Monitors system metrics.
- **Grafana**: Provides dashboards for visualizing metrics.

## Future Enhancements

- Implement real-time username reservations.
- Support for Unicode usernames.
- Integration of vanity URL features.
- Mobile-optimized username suggestions.
- Enforcement of username policies.

## Conclusion

This prototype demonstrates a scalable and efficient username availability system, suitable for further development and enhancement.

chmod +x /Users/jonahanand/dev/system-design/username-availability/backend/scripts/cleanup.sh && cd /Users/jonahanand/dev/system-design/username-availability/backend && ./scripts/cleanup.sh
