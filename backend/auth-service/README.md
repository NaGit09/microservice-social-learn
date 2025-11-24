# 🔐 Auth Service

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flat&logo=redis&logoColor=white)
![Kafka](https://img.shields.io/badge/kafka-%23231F20.svg?style=flat&logo=apachekafka&logoColor=white)

## 📖 Description

This is the **Authentication Microservice** for the Social Learning Platform.

Built with **NestJS**, this service handles the security layer of the application. 
It manages user registration, login, and identity verification. 
It utilizes **Passport** and **JWT** strategies for secure authentication and **Redis**
 for managing stateful sessions and refresh tokens. 
 It communicates with other services (like User or Notification services) via **Kafka**.

**Key Features:**
* User Registration & Account Management
* Password Hashing (Bcrypt)
* Token Generation (JWT) & Refresh Token Flows
* Session/State Management via Redis
* Data Validation using Zod

## 🛠 Tech Stack

* **Framework:** NestJS
* **Database:** MongoDB (Persistence), Redis (Caching/Sessions)
* **Messaging:** Kafka
* **Libraries:**
    * `@nestjs/jwt` & `passport` (Authentication)
    * `bcrypt` (Encryption)
    * `zod` (Validation)
* **Language:** TypeScript

## ⚙️ Prerequisites

Before running this service, ensure you have the following installed and running:

* **Node.js** (v18+)
* **Docker & Docker Compose** (for Kafka/Redis/Mongo containers)
* **MongoDB** instance
* **Redis** instance
* **Kafka** broker

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
JWT secret key 

JWT_SECRET=@YourSecretKey
JWT_REFRESH_SECRET=@YourSecretKey

Service port

PORT=8081

MongoDB connection string

MONGODB_URL=@YourMongoDbConnectionString

Kafka config

KAFKA_BROKER=kafka:9092
KAFKA_CLIENT_ID=auth-service
KAFKA_GROUP_ID=auth-service-consumer

Redis config

REDIS_HOST=@YourRedisHost
REDIS_PORT=6379

Declare default avatar

DEFAULT_AVATAR_ID=@YourFileId
DEFAULT_AVATAR_URL=@YourFileUrl
DEFAULT_AVATAR_TYPE=@YourFileType
DEFAULT_AVATAR_NAME=@YourFileName
```
## 🏃‍♂️ Running the Application
before running the application, make sure your docker-compose has successfully run kafka, redis, mongodb

Run with command line 
```
npm run start:dev
```
## 🐳 Docker Support

 Build and run just this service
 ```
docker-compose up -d auth-service
```

## 🧪 Testing

Unit tests
```
npm run test
```
End-to-end tests
```
npm run test:e2e
```

---

### 💡 Improvements I made for you:

1.  **Professional Description:** I changed "social learn" to "Social Learning Platform" and "gen token" to "Token Generation". This sounds much more appropriate for a portfolio or professional project.
2.  **Formatting:** I removed the brackets `[]` around the tech names (e.g., `[NestJS]`) because brackets usually imply "fill this in later."
3.  **Specifics:** I added a **Configuration (.env)** section. In microservices, knowing *which* ports and secrets are needed (like `REDIS_HOST` or `KAFKA_BROKER`) is critical for other developers to run your service.
4.  **Typos Fixed:** Changed "Liberaries" to "Libraries".
5.  **Key Features List:** Added a bullet point list in the description so people can quickly see exactly what the service *does*.

**Would you like me to create a `.env.example` file template to go with this?**