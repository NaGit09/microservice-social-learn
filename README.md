# Microservice Social Learn

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

**Microservice Social Learn** is a scalable, distributed social learning platform. It seamlessly blends social networking mechanics with educational content, powered by a robust microservices architecture. Encapsulated in Docker, it features real-time interactions, intelligent content recommendations, and a modern reactive UI.

---

## 🌟 Key Features

- **🔐 Secure Authentication**: Robust JWT-based authentication, user registration, and secure password management.
- **📝 Interactive Social Feed**: Create posts, share media, like, and comment in real-time.
- **💬 Real-time Messaging**: Instant private messaging powered by Socket.io.
- **🔔 Live Notifications**: Event-driven notification system ensuring users never miss an update.
- **🧠 Smart Recommendations**: Python-powered ML engine for personalized content and connection suggestions.
- **📂 Media Management**: Dedicated service for efficient file uploads and storage.

---

## 🛠 Tech Stack

### Frontend

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/pinia-%23FFE450.svg?style=for-the-badge&logo=pinia&logoColor=black)

### Backend

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

### Infrastructure & Database

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Kong](https://img.shields.io/badge/Kong-0033aa?style=for-the-badge&logo=kong&logoColor=white)

---

## 🏗 Architecture

The system utilizes **Kong API Gateway** to route requests to specialized microservices. Services communicate asynchronously via **Kafka** for high throughput and decoupled logic.

### 📦 Microservices Breakdown

| Service                  | Port   | Description                                   | Tech Framework    |
| :----------------------- | :----- | :-------------------------------------------- | :---------------- |
| **Frontend**             | `5173` | Responsive SPA for user interaction.          | Vue 3, Vite       |
| **Auth Service**         | `8081` | Authentication, Authorization, User Profiles. | NestJS            |
| **Post Service**         | `8087` | CRUD for Posts, Comments, and Likes.          | NestJS            |
| **Message Service**      | `8093` | Real-time Chat (1-on-1, Groups).              | NestJS, Socket.io |
| **Notification Service** | `8084` | User alerts and push notifications.           | NestJS, Socket.io |
| **Upload Service**       | `8089` | Image and video file handling.                | NestJS            |
| **Recomment Service**    | `8086` | ML-based Content Recommendations.             | Python, Flask     |

---

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- **Docker Desktop** (Engine 20.10+): Essential for containerization.
- **Node.js** (v18+): Required for local frontend development.

### 1️⃣ Configuration

Before running the services, you must facilitate the environment variables.
The project relies on `.env` files in each service directory.

**Manual Setup:**
Navigate to each service folder (`backend/*-service` and `frontend`) and create a `.env` file based on the provided `.env.example`.

**Quick Setup (Unix/Mac):**
You can run this command from the project root to copy all examples automatically:

```bash
find backend -name ".env.example" -exec sh -c 'cp "$1" "${1%.example}"' _ {} \;
cp frontend/.env.example frontend/.env
```

### 2️⃣ Run the Backend

We use Docker Compose to orchestrate the entire backend infrastructure (Databases, Kafka, Services).

```bash
# Clone the repository
git clone https://github.com/your-username/microservice-social-learn.git
cd microservice-social-learn

# Start all ecosystem services in detached mode
docker-compose up -d
```

> **Note:** The first run may take a few minutes as Docker images are downloaded and built.

### 3️⃣ Run the Frontend

For the best development experience (HMR), run the frontend locally.

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔧 Management & Tooling

The Docker environment includes several GUI tools for managing the infrastructure:

| Tool                   | URL                                            | Credentials (if default)        |
| :--------------------- | :--------------------------------------------- | :------------------------------ |
| **Kong Admin (Konga)** | [http://localhost:1337](http://localhost:1337) | Create Admin User on first load |
| **Kafka UI**           | [http://localhost:8080](http://localhost:8080) | No auth                         |
| **Mongo Express**      | [http://localhost:8083](http://localhost:8083) | `admin` / `pass` (check env)    |
| **Redis Insight**      | [http://localhost:5540](http://localhost:5540) | No auth                         |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
