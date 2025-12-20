# Upload Service

The **Upload Service** is a dedicated microservice specifically designed to handle file upload operations within the social learning platform. It manages file storage, retrieval, and deletion, interacting with Supabase for persistent storage.

## Tech Stack

This service is built using the following technologies:

- **Framework**: [NestJS](https://nestjs.com/) (Node.js framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose)
- **Message Broker**: [Kafka](https://kafka.apache.org/) (for asynchronous events)
- **Storage**: [Supabase](https://supabase.com/) (Object Storage)
- **Caching**: [Redis](https://redis.io/)
- **Monitoring**: [Prometheus](https://prometheus.io/)
- **Validation**: [Zod](https://zod.dev/)

## Environment Variables

The service requires the following environment variables to be configured (see `.env.example`):

| Variable            | Description                                  |
| ------------------- | -------------------------------------------- |
| `PORT`              | The port the service runs on (default: 8089) |
| `MONGODB_URL`       | MongoDB connection string                    |
| `KAFKA_BROKER`      | Kafka broker address                         |
| `SUPABASE_URL`      | Supabase API URL                             |
| `SUPABASE_ANON_KEY` | Supabase Anonymous Key                       |
| `SUPABASE_BUCKET`   | Supabase Storage Bucket name                 |
| `REDIS_URL`         | Redis connection string                      |

## API Endpoints

### Upload

| Method     | Endpoint           | Description            | Body / Params                                   |
| :--------- | :----------------- | :--------------------- | :---------------------------------------------- |
| **POST**   | `/upload/single`   | Upload a single file   | **Form-Data**: `file` (File), `userId` (Text)   |
| **POST**   | `/upload/multiple` | Upload multiple files  | **Form-Data**: `files` (Files), `userId` (Text) |
| **DELETE** | `/upload/draft`    | Delete old draft files | -                                               |
| **DELETE** | `/upload`          | Delete files by ID     | **JSON**: `{ "ids": ["uuid1", "uuid2"] }`       |

### System

| Method  | Endpoint   | Description           |
| :------ | :--------- | :-------------------- |
| **GET** | `/health`  | Health check endpoint |
| **GET** | `/metrics` | Prometheus metrics    |

## Installation & Running

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run in production mode
npm run start:prod
```
