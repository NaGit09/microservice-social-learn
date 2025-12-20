# 🔐 Auth Service

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white)
![Kafka](https://img.shields.io/badge/kafka-%23231F20.svg?style=flat&logo=apachekafka&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat&logo=Prometheus&logoColor=white)

## 📖 Description

This is the **Authentication Microservice** for the Social Learning Platform.

Built with **NestJS**, this service handles the security layer of the application. It manages user registration, login, and identity verification. It utilizes **Passport** and **JWT** strategies for secure authentication and **Redis** for managing stateful sessions and refresh tokens. It communicates with other services (like User or Notification services) via **Kafka**.

**Key Features:**

- User Registration & Account Management
- Secure Authentication (JWT & Passport)
- Role-based Access Control (RBAC)
- Password Hashing (Bcrypt)
- Validations (Zod)
- Real-time Data processing with Kafka
- Monitoring with Prometheus

## 📡 API Endpoints

### Authentication (`/auth`)

| Method  | Endpoint                | Description                              |
| :------ | :---------------------- | :--------------------------------------- |
| `POST`  | `/auth/register`        | Register a new user account              |
| `POST`  | `/auth/login`           | Login with email and password            |
| `PATCH` | `/auth/refresh`         | Refresh access token using refresh token |
| `PATCH` | `/auth/logout`          | Logout user and invalidate refresh token |
| `POST`  | `/auth/forgot-password` | Request password reset OTP (sends email) |
| `POST`  | `/auth/reset-password`  | Reset password using OTP                 |

### Admin (`/admin`)

| Method   | Endpoint                 | Description                                  |
| :------- | :----------------------- | :------------------------------------------- |
| `GET`    | `/admin`                 | Get all users (paginated) with metadata      |
| `GET`    | `/admin/stats`           | Get user statistics (total, new today, etc.) |
| `DELETE` | `/admin/:id`             | Delete a user account                        |
| `PATCH`  | `/admin/ban/:id`         | Ban/Unban a user                             |
| `PATCH`  | `/admin/permissions/:id` | Update user permissions                      |
| `PATCH`  | `/admin/reset-password`  | Admin force reset user password              |

### User Profile (`/user`)

| Method   | Endpoint            | Description                     |
| :------- | :------------------ | :------------------------------ |
| `GET`    | `/user/info/:id`    | Get user basic info (cacheable) |
| `GET`    | `/user/profile/:id` | Get full user profile           |
| `PUT`    | `/user/bio`         | Update user bio                 |
| `PUT`    | `/user/avatar`      | Update user avatar              |
| `DELETE` | `/user/avatar`      | Remove user avatar              |
| `POST`   | `/user/report`      | Report another user             |
| `GET`    | `/user/search`      | Search users by name/username   |

### Social Features (`/follow`)

| Method   | Endpoint                       | Description             |
| :------- | :----------------------------- | :---------------------- |
| `POST`   | `/follow/create`               | Send a follow request   |
| `DELETE` | `/follow/delete`               | Unfollow a user         |
| `PATCH`  | `/follow/:id/accept`           | Accept a follow request |
| `PATCH`  | `/follow/:id/reject`           | Reject a follow request |
| `GET`    | `/follow/:id/followers`        | Get list of followers   |
| `GET`    | `/follow/:id/followings`       | Get list of following   |
| `GET`    | `/follow/get/:target/:request` | Check follow status     |     |

## 🛠 Tech Stack

- **Framework:** NestJS
- **Database:** MongoDB (Persistence), Redis (Caching/Sessions)
- **Messaging:** Kafka
- **Authentication:**
  - `@nestjs/jwt` & `passport` (Authentication)
  - `passport-jwt` & `passport-local` (Strategies)
  - `bcrypt` (Encryption)
- **Validation:** `zod`
- **Monitoring:** Prometheus (`@willsoto/nestjs-prometheus`)
- **Language:** TypeScript
- **Testing:** Jest

## ⚙️ Prerequisites

Before running this service, ensure you have the following installed and running:

- **Node.js** (v18+)
- **Docker & Docker Compose** (for Kafka/Redis/Mongo containers)
- **MongoDB** instance
- **Redis** instance
- **Kafka** broker

## 🚀 Installation

1.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Set up Environment Variables:**
    Copy the example env file and configure your keys (Database URLs, JWT Secrets, etc.).
    ```bash
    cp .env.example .env
    ```

## 🔧 Configuration (.env)

Ensure your `.env` file contains the following key configurations:

```env
# JWT secret key
JWT_SECRET=@YourSecretKey
JWT_REFRESH_SECRET=@YourSecretKey

# Service port
PORT=8081

# MongoDB connection string
MONGODB_URL=@YourMongoDbConnectionString

# Kafka config
KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=auth-service
KAFKA_GROUP_ID=auth-service-consumer

# Redis config
REDIS_HOST=@YourRedisHost
REDIS_PORT=6379

# Declare default avatar
DEFAULT_AVATAR_ID=@YourFileId
DEFAULT_AVATAR_URL=@YourFileUrl
DEFAULT_AVATAR_TYPE=@YourFileType
DEFAULT_AVATAR_NAME=@YourFileName
```

## 🏃‍♂️ Running the Application

Before running the application, make sure your data services are running (Kafka, Redis, MongoDB).

Run with command line:

```bash
npm run start:dev
```

## 🐳 Docker Support

Build and run just this service:

```bash
docker-compose up -d auth-service
```

## 🧪 Testing

Unit tests:

```bash
npm run test
```

End-to-end tests:

```bash
npm run test:e2e
```
