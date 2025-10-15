# M5.2-Node.JS

# Description

- The FHL Logistics API is a backend application developed to manage the delivery order lifecycle in a logistics company. This system replaces manual spreadsheet-based processes, reducing delays, duplication, and difficulties in order tracking..

# The API allows:

- Register and manage customers, delivery addresses, warehouses, and products.
Create and assign delivery orders, monitoring their status (pending, in transit, delivered).
View order histories by customer.
Implement secure authentication with roles (administrator and analyst) to control access.

- The project is built as a RESTful API using Node.js and Express, with TypeScript support for improved maintainability and scalability. It integrates PostgreSQL as a relational database, Sequelize as an ORM, JWT for authentication, and Swagger for interactive documentation.
This project was developed as part of a performance test for the Node.js 5.2 module, focusing on clean code practices, robust validation, and a modular structure.
Key Features

# Authentication and Authorization:

- User registration and login with roles (administrator and analyst).
Route protection using JWT.
Role-based access control: Administrators have full CRUD; analysts only view and update order statuses.


# Entity Management:

- Customers: Registration with unique ID validation, search by ID, and list.
- Warehouses: Activation/deactivation, list of active warehouses with stock.
- Products: Query by code, logical deletion (soft delete).
- Orders: Creation with stock and existing customer validation, status update, general history, and by customer.


# Validaciones y Middlewares:

Checking available stock before creating orders.
Preventing duplicates in customer IDs.
Validating input data using Joi.


# Data Persistence:

PostgreSQL database with migrations and seeders for initialization.
Relational models for customers, addresses, warehouses, products, orders, and more.

# Documentation:

Swagger UI for interactive exploration and testing of endpoints.

# Best Practices:

Clean code with explanatory comments.
Gitflow branching strategy (main, develop, feature/*).
Conventional Commits for descriptive change history.

# Requirements

- Node.js: Version 18 or higher (using nvm is recommended for version management).
- PostgreSQL: Version 13 or higher, with a user and database configured.
- Git: For cloning the repository and managing versions.
- Optional: Docker and Docker Compose for containerized deployment.

# Installation: 

Follow these steps to set up the project locally.
1. Clone the Repository
bashgit clone https://github.com/[your_username]/fhl-logistica-api.git
cd fhl-logistica-api
2. Install Dependencies
The project uses npm for package management. Install the production and development dependencies:
bashnpm install

# Main Dependencies:

- express: Framework for creating the REST API.
- sequelize: ORM for interacting with PostgreSQL.
- pg and pg-hstore: Drivers for PostgreSQL.
- jsonwebtoken: For JWT authentication.
- bcryptjs: For password hashing.
- joi: For data validation.
- swagger-ui-express and swagger-jsdoc: For Swagger documentation.
- dotenv: For environment variable management.

# Development Dependencies:

typescript: TypeScript compiler.
ts-node-dev: For development with autoreloading.
sequelize-cli: For migrations and seeders.
TypeScript types: @types/express, @types/jsonwebtoken, etc.

For a complete list, see the package.json file.

3. Setting Environment Variables
Copy the example file .env.example to .env and fill in your values:
bashcp .env.example .env
Example content in .env:
textDB_HOST=localhost
DB_PORT=5432
DB_NAME=fhl_logistica
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_secure_jwt_secret
PORT=3000

DB_*: PostgreSQL credentials.
JWT_SECRET: Secret key for signing JWT tokens (generate a secure one, e.g., using openssl rand -hex 32).
PORT: Server port (default: 3000).

4. Configure the Database

Make sure PostgreSQL is running and create the database if it doesn't exist (use psql or pgAdmin).
Run the migrations to create the tables:
bashnpx sequelize-cli db:migrate

Populate the database with initial data (users, customers, warehouses, products):
bashnpm run seed

5. Compile and Run

Development Mode (with automatic reload):
bashnpm run dev

Production Mode (compile first):
bashnpm run build
npm start

The server will be available at http://localhost:3000.
Usage
API Access

Authentication: Use /auth/register or /auth/login to obtain a JWT token. Include it in headers as Authorization: Bearer <token>.
Main Endpoints:

/clients: Manages clients (GET for list, POST for search by ID).
/warehouses: Manages warehouses (GET for active, PATCH for activate/deactivate).
/products: Manages products (GET for code, DELETE for logic).
/orders: Manages orders (POST for create, PATCH for status, GET for history).

For full details, see the Swagger documentation.

Swagger Documentation
Access the interactive interface at http://localhost:3000/api-docs. Here you can test endpoints, view data schemas, and authenticate directly.
Roles and Permissions

Administrator: Full access (CRUD on all entities).
Analyst: Only queries and order status updates.

Testing

Use tools like Postman or the Swagger interface for testing.
Check validations: Try creating orders without stock or with duplicate orders to check for errors.

Deployment with Docker (Optional)
For a containerized environment:

Make sure you have Docker and Docker Compose installed.
Build and deploy services:
bashdocker-compose up --build

Run migrations and seeders inside the container:
bashdocker-compose exec app npx sequelize-cli db:migrate
docker-compose exec app npm run seed


The server will be at http://localhost:3000, and PostgreSQL at localhost:5432.
Contribution
This project follows Gitflow:

main: Production branch.
develop: Integration branch.
feature/*: Branches for new features.

Use Conventional Commits for commit messages, e.g.:
bashgit commit -m "feat: add new endpoint for order history"

Create a fork, develop on a feature branch, and send a Pull Request to develop.
Ensure the code follows Clean Code practices and has clear comments.

Common Issues and Solutions

DB Connection Error: Check credentials in .env and that PostgreSQL is running.
Invalid Token: Make sure you use Bearer <token> in headers.
Failed Migrations: Review logs and make sure the tables don't already exist (use db:migrate:undo:all if necessary).

Coder Information

Name: Victor Suarez
Clan: Node.JS

License
This project is licensed under the MIT License.