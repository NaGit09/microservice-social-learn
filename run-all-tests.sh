#!/bin/bash

NETWORK_NAME="microservice-social-learn_kong-net"

echo "Running Auth Service Tests..."
docker run --rm -i \
  -v $(pwd):/app \
  --network $NETWORK_NAME \
  grafana/k6 run /app/backend/auth-service/src/k6-test.js

echo "Running Post Service Tests..."
docker run --rm -i \
  -v $(pwd):/app \
  --network $NETWORK_NAME \
  grafana/k6 run /app/backend/post-service/src/k6-test.js

echo "Running Message Service Tests..."
docker run --rm -i \
  -v $(pwd):/app \
  --network $NETWORK_NAME \
  grafana/k6 run /app/backend/message-service/src/k6-test.js

echo "Running Notification Service Tests..."
docker run --rm -i \
  -v $(pwd):/app \
  --network $NETWORK_NAME \
  grafana/k6 run /app/backend/notification-service/src/k6-test.js

echo "Running Upload Service Tests..."
docker run --rm -i \
  -v $(pwd):/app \
  --network $NETWORK_NAME \
  grafana/k6 run /app/backend/upload-service/src/k6-test.js

echo "Running Recomment Service Tests..."
docker run --rm -i \
  -v $(pwd):/app \
  --network $NETWORK_NAME \
  grafana/k6 run /app/backend/recomment-service/src/k6-test.js

echo "All tests completed."
