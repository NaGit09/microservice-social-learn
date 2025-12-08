import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export let options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

const BASE_URL = "http://recomment-service:8086";

export default function () {
  const userId = "user_" + randomString(8);

  // 1. Get Recommendations (TF-IDF)
  const recommendRes = http.get(`${BASE_URL}/recommend/${userId}`);
  check(recommendRes, {
    "get recommendations status is 200 or 404": (r) =>
      r.status === 200 || r.status === 404,
  });

  sleep(1);

  // 2. Get Semantic Recommendations
  const semanticRes = http.get(`${BASE_URL}/recommend/semantic/${userId}`);
  check(semanticRes, {
    "get semantic recommendations status is 200 or 404": (r) =>
      r.status === 200 || r.status === 404,
  });

  sleep(1);
}
