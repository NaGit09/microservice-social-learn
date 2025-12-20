# Notification Service

The **Notification Service** is a microservice responsible for handling real-time notifications and message dispatching within the social learning platform. It consumes events from Kafka, persists notifications to MongoDB, and delivers them to connected clients via WebSockets (Socket.io).

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**:
  - **MongoDB** (via Mongoose): Stores notification history.
  - **Redis**: Used for managing online users and socket sessions (implied usage for scalable socket adapters).
- **Messaging**: [Kafka](https://kafka.apache.org/) (via `kafkajs`)
- **Real-time**: [Socket.io](https://socket.io/)
- **Monitoring**: Prometheus (`prom-client`, `@willsoto/nestjs-prometheus`)

## API Documentation

### HTTP Endpoints

BASE URL: `/notification`

| Method | Endpoint           | Description                                       | Query Params                              |
| :----- | :----------------- | :------------------------------------------------ | :---------------------------------------- |
| `GET`  | `/:userId`         | Get a paginated list of notifications for a user. | `page` (default: 1), `size` (default: 10) |
| `POST` | `/:notificationId` | Mark a specific notification as read.             | -                                         |

### WebSocket Events (Socket.io)

**Connection:**
Clients must connect with a `userId` query parameter to be identified and joined to their private room.

- **Query**: `?userId=<user_id_string>`

**Server-to-Client Events:**

- **Event**: `notification`
- **Payload**: `Notification` object (contains actor, verb, object, timestamp, etc.)

### Kafka Consumers

The service listens to various Kafka topics to generate notifications based on user interactions in other services.

| Topic            | Event Pattern    | Description                       |
| :--------------- | :--------------- | :-------------------------------- |
| `like-post`      | `like-post`      | User liked a post.                |
| `like-comment`   | `like-comment`   | User liked a comment.             |
| `follow-user`    | `follow-user`    | User followed another user.       |
| `follow-request` | `follow-request` | User requested to follow someone. |
| `follow-accept`  | `follow-accept`  | User accepted a follow request.   |
| `share-post`     | `share-post`     | User shared a post.               |
| `comment-post`   | `comment-post`   | User commented on a post.         |
| `reply-comment`  | `reply-comment`  | User replied to a comment.        |

**Dead Letter Queues (DLQ):**
Failed messages are sent to DLQ topics with the suffix `.DLQ` (e.g., `like-post.DLQ`).

## Installation & Running

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run in production mode
npm run start:prod
```

## Environment Variables

Ensure the following environment variables are set (typically in `.env`):

- `PORT`: Service port (default: 8089)
- `KAFKA_BROKER`: Kafka broker address
- `KAFKA_CLIENT_ID`: Kafka client ID
- `KAFKA_GROUP_ID`: Kafka consumer group ID
- `MONGO_URI`: MongoDB connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
