<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Message Service

A robust microservice responsible for handling real-time messaging, conversation management, and user interactions within the social learning platform. Built with NestJS, it leverages WebSockets for real-time communication and Kafka for event-driven architecture.

## Tech Stack

This project uses the following technologies:

- **Framework:** [NestJS](https://nestjs.com/) (Node.js framework)
- **Database:** `MongoDB` (with `Mongoose`)
- **Message Broker:** `Kafka` (using `kafkajs`)
- **Caching:** `Redis` (using `ioredis`)
- **Real-time Communication:** `Socket.io` (WebSockets)
- **Authentication:** `Passport-JWT`
- **Validation:** `Zod`
- **Monitoring:** `Prometheus`

## API Endpoints

The service exposes the following REST API endpoints:

### Conversation APIs

| Method  | Endpoint                           | Description                                                                         |
| :------ | :--------------------------------- | :---------------------------------------------------------------------------------- |
| `GET`   | `/conversation/:id`                | Get details of a conversation (supports pagination via `page` and `limit` queries). |
| `POST`  | `/conversation/create`             | Create a new conversation.                                                          |
| `POST`  | `/conversation/accept`             | Accept a conversation request.                                                      |
| `PATCH` | `/conversation/rename`             | Rename a group conversation.                                                        |
| `PATCH` | `/conversation/avatar`             | Change the avatar of a group conversation.                                          |
| `PATCH` | `/conversation/owner`              | Change the owner of a group conversation.                                           |
| `PATCH` | `/conversation/pin`                | Pin a message in a conversation.                                                    |
| `PATCH` | `/conversation/ban`                | Ban a user from a conversation.                                                     |
| `PATCH` | `/conversation/paticipants/add`    | Add participants to a conversation.                                                 |
| `PATCH` | `/conversation/paticipants/remove` | Remove participants from a conversation.                                            |

### Message APIs

| Method  | Endpoint            | Description                                                                               |
| :------ | :------------------ | :---------------------------------------------------------------------------------------- |
| `GET`   | `/messages/:convId` | Get messages for a specific conversation (supports `page`, `size`, and `userId` queries). |
| `POST`  | `/messages/create`  | Send a new message.                                                                       |
| `POST`  | `/messages/forward` | Forward a message to another conversation.                                                |
| `PATCH` | `/messages/recall`  | Recall (delete/unsend) a message.                                                         |
| `PATCH` | `/messages/react`   | React to a message (like, love, etc.).                                                    |

## Project Setup

### Installation

```bash
$ npm install
```

### Running the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
