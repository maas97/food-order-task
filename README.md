# Food Ordering Task

A microservices-based backend architecture for food ordering, built with NestJS, TypeScript, and PostgreSQL.

## Architecture Overview

The task is built using the following:

### 1. API Gateway (Port 3000)
- Acts as a bridge for all client requests from the frontend.
- Routes requests to appropriate microservices
- Handles HTTP communication with clients
- Provides Swagger API documentation at `http://localhost:3000/api` endpoint.
- Communicates with microservices via regular TCP

### 2. Authentication Service (Port 3001)
- Handles user registration and login
- Manages JWT authentication.
- Only accepts TCP communication.
- Stores user data in PostgreSQL database

### 3. Order Service (Port 3002)
- Processes food orders from authenticated users
- Validates order data (items, pricing)
- Only accepts TCP communication (no direct HTTP access).
- Stores order data in PostgreSQL database

## Technical Stack

- **Language & Framework**: TypeScript, NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JSON Web Tokens (JWT)
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger/OpenAPI
- **Communication**: TCP for inter-service communication

## Features

### Authentication Service
- User registration with password hashing
- User login with JWT token generation
- Token validation
- Secure password using bcrypt

### Order Service
- Create new orders with validation
- Associate orders with authenticated users

### API Gateway
- Route HTTP requests to appropriate microservices
- JWT-based authentication guard
- Swagger API documentation
- Error handling with appropriate HTTP status codes
- Rate limiting to prevent abuse and brute force attacks.

## Installation and Setup

### Prerequisites
- Node.js
- Docker and Docker Compose
- Git
- PostgreSQL server

### Clone the Repository
```bash
git clone https://github.com/maas97/food-order-task.git
cd food-order-task
```

### Running with Docker Compose
The easiest way to run the entire platform is using Docker Compose:

```bash
docker-compose up -d
```

This will:
1. Build all service images
2. Create and initialize PostgreSQL databases
3. Start all services in the correct order
4. Expose the API Gateway on port 3000


## API Documentation

You can access the Swagger API documentation at:
```
http://localhost:3000/api
```


## Security Considerations

- All microservices except the API Gateway are not exposed to the public internet.
- JWT tokens are used for authentication between services
- Passwords are securely hashed using bcrypt
- Database credentials are stored as environment variables
- Services communicate over an internal Docker network

### Running Tests
```bash
docker-compose run api-gateway npm test
docker-compose run auth-service npm test
docker-compose run order-service npm test
```

## Future Improvements

- Add stock availability checking feature.
- Add Redis for caching frequently accessed data
- Implement refresh tokens for improved security
- Add CI/CD pipeline with GitHub Actions.
- Add monitoring and logging infrastructure
- Implement database migrations for production deployments.