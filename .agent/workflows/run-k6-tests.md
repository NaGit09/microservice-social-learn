---
description: Run k6 load tests using Docker
---

Since the test scripts use service names (e.g., `http://auth-service:8081`), the easiest way to run them is using a k6 Docker container attached to your project's network.

1. **Identify your network name**:
   Usually `microservice-social-learn_kong-net` or similar. Check with `docker network ls`.

2. **Run a test**:
   Use the following command, replacing `[path-to-script]` with the script you want to run.

   ```bash
   docker run --rm -i \
     -v $(pwd):/app \
     --network microservice-social-learn_kong-net \
     grafana/k6 run /app/[path-to-script]
   ```

   **Examples:**

   - **Auth Service**:

     ```bash
     docker run --rm -i \
       -v $(pwd):/app \
       --network microservice-social-learn_kong-net \
       grafana/k6 run /app/backend/auth-service/src/k6-test.js
     ```

   - **Post Service**:

     ```bash
     docker run --rm -i \
       -v $(pwd):/app \
       --network microservice-social-learn_kong-net \
       grafana/k6 run /app/backend/post-service/src/k6-test.js
     ```

   - **Message Service**:
     ```bash
     docker run --rm -i \
       -v $(pwd):/app \
       --network microservice-social-learn_kong-net \
       grafana/k6 run /app/backend/message-service/src/k6-test.js
     ```
