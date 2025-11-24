# Microservice Social Learn

A scalable social learning platform built with a microservices architecture, featuring real-time messaging, content sharing, and personalized recommendations.

## 🚀 Overview

This project demonstrates a modern, distributed system application using **Vue.js** for the frontend and a suite of **NestJS** and **Python** microservices for the backend. It leverages **Kafka** for asynchronous communication, **Kong** as an API Gateway, and **MongoDB** & **Redis** for data storage and caching.

## 🏗 Architecture

The system is composed of the following independent services:

```
graph TD
    Client[Frontend (Vue.js)] --> Kong[Kong API Gateway]
    Kong --> Auth[Auth Service]
    Kong --> Post[Post Service]
    Kong --> Upload[Upload Service]
    Kong --> Msg[Message Service]
    Kong --> Notif[Notification Service]
    Kong --> Rec[Recomment Service]
    
    Auth & Post & Upload & Msg & Notif & Rec --> Kafka[Kafka Message Broker]
    Auth & Post & Upload & Msg & Notif & Rec --> Mongo[(MongoDB)]
    Auth & Post & Upload & Msg & Notif & Rec --> Redis[(Redis)]
```

### Services

| Service | Port | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | `5173` | Vue.js, Pinia, Vite | User interface for the social platform. |
| **Auth Service** | `8081` | NestJS | User authentication, profiles, and follow system. |
| **Post Service** | `8087` | NestJS | Manages posts, comments, and likes. |
| **Message Service** | `8093` | NestJS, Socket.io | Real-time chat functionality. |
| **Notification Service** | `8084` | NestJS, Socket.io | Real-time user notifications. |
| **Upload Service** | `8089` | NestJS | Handles file and media uploads. |
| **Recomment Service** | `8086` | Python/Flask | Content recommendation engine using ML. |

### Infrastructure

*   **Kong Gateway**: API Gateway to manage traffic and routing (Ports: `8000` Proxy, `8001` Admin).
*   **Kafka**: Event streaming platform for inter-service communication.
*   **MongoDB**: Primary NoSQL database.
*   **Redis**: In-memory data structure store for caching.
*   **Zookeeper**: Coordination service for Kafka.

## 🛠 Prerequisites

*   **Docker** and **Docker Compose** installed.
*   **Node.js** (v18+ recommended) for local frontend development.

## 📦 Installation & Setup

### 1. Backend (Docker Compose)

The easiest way to run the entire backend infrastructure is using Docker Compose.

```bash
# Start all services
docker-compose up -d
```

This will spin up:
*   All microservices
*   Databases (Mongo, Redis, Postgres for Kong)
*   Kafka & Zookeeper
*   Kong Gateway & Konga UI
*   Management UIs (Kafka UI, Mongo Express, Redis Insight)

**Useful Management Interfaces:**
*   **Kafka UI**: [http://localhost:8080](http://localhost:8080)
*   **Mongo Express**: [http://localhost:8083](http://localhost:8083)
*   **Redis Insight**: [http://localhost:5540](http://localhost:5540)
*   **Konga (Kong Admin)**: [http://localhost:1337](http://localhost:1337)

### 2. Frontend

To run the frontend locally:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application should now be accessible at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## 🔧 Configuration

### Environment Variables

Each service has its own `.env` file located in its respective directory under `backend/`.
The `docker-compose.yml` also defines environment variables for the containerized environment.

### Kong Gateway Setup

After starting the containers, you may need to configure Kong Gateway routes and services. You can use **Konga** ([http://localhost:1337](http://localhost:1337)) to manage this visually.

## 🧪 Development

*   **Backend**: Each service in `backend/` is a standalone project. You can run them individually for development if you have the necessary infrastructure (DB, Kafka) running locally or via Docker.
*   **Frontend**: Located in `frontend/`. Uses Vite for fast HMR.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
