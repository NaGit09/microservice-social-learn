<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <br />
  <a href="https://www.mongodb.com/" target="blank"><img src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34daa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" width="200" alt="MongoDB Logo" /></a>
</p>

# Post Service

The **Post Service** handles all operations related to posts, comments, likes, and administration within the microservices architecture. It is built with **NestJS** and uses **MongoDB** for data persistence.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
- **Message Broker:** [Kafka](https://kafka.apache.org/) (using `kafkajs`)
- **Caching/Store:** [Redis](https://redis.io/) (using `ioredis`)
- **Authentication:** [Passport](http://www.passportjs.org/) (JWT Strategy)
- **Metrics:** [Prometheus](https://prometheus.io/) (using `prom-client`)
- **Validation:** [Zod](https://zod.dev/)
- **Security:** [Helmet](https://helmetjs.github.io/)

## API Endpoints

### Post Management (`/post`)

| Method   | Endpoint             | Description                                        | Auth Required |
| :------- | :------------------- | :------------------------------------------------- | :------------ |
| `POST`   | `/post`              | Create a new post                                  | Yes           |
| `PATCH`  | `/post`              | Update an existing post                            | Yes           |
| `DELETE` | `/post/:id`          | Delete a post                                      | Yes           |
| `GET`    | `/post/:id`          | Get a specific post by ID                          | Yes           |
| `GET`    | `/post/user/:id`     | Get all posts by a specific user (paginated)       | Yes           |
| `POST`   | `/post/share`        | Share a post                                       | Yes           |
| `GET`    | `/post/:id/total`    | Get total interactions (likes/comments) for a post | Yes           |
| `GET`    | `/post/random/:size` | Get a list of random posts                         | Yes           |

### Comment Management (`/comment`)

| Method   | Endpoint             | Description                              | Auth Required |
| :------- | :------------------- | :--------------------------------------- | :------------ |
| `POST`   | `/comment`           | Create a new comment                     | Yes           |
| `PUT`    | `/comment`           | Update an existing comment               | Yes           |
| `DELETE` | `/comment/:id`       | Delete a comment                         | Yes           |
| `POST`   | `/comment/reply`     | Reply to a comment                       | Yes           |
| `GET`    | `/comment/post/:id`  | Get root comments for a post (paginated) | Yes           |
| `GET`    | `/comment/reply/:id` | Get replies for a comment (paginated)    | Yes           |

### Like Management (`/likes`)

| Method   | Endpoint       | Description                  | Auth Required |
| :------- | :------------- | :--------------------------- | :------------ |
| `POST`   | `/likes`       | Like a target (post/comment) | Yes           |
| `DELETE` | `/likes`       | Unlike a target              | Yes           |
| `GET`    | `/likes/total` | Get total likes for a target | Yes           |

### Admin Management (`/post/admin`)

| Method   | Endpoint                  | Description                              | Auth Required |
| :------- | :------------------------ | :--------------------------------------- | :------------ |
| `GET`    | `/post/admin/posts`       | Get all posts (paginated, Admin only)    | Yes (Admin)   |
| `DELETE` | `/post/admin/post/:id`    | Delete a post (Admin only)               | Yes (Admin)   |
| `GET`    | `/post/admin/comments`    | Get all comments (paginated, Admin only) | Yes (Admin)   |
| `DELETE` | `/post/admin/comment/:id` | Delete a comment (Admin only)            | Yes (Admin)   |
| `GET`    | `/post/admin/stats`       | Get service statistics (Admin only)      | Yes (Admin)   |

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
