import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
  vus: 5, // Lower VUs for upload as it's heavier
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Allow more time for uploads
  },
};

const BASE_URL = 'http://upload-service:8089';

// Create a dummy file content
const binFile = new Uint8Array([104, 101, 108, 108, 111]); // "hello"

export default function () {
  const userId = 'user_' + randomString(8);

  // 1. Upload Single File
  const data = {
    file: http.file(binFile, 'test.txt', 'text/plain'),
    userId: userId,
  };

  const uploadRes = http.post(`${BASE_URL}/upload/single`, data);

  check(uploadRes, {
    'upload single status is 201': (r) => r.status === 201,
  });

  sleep(1);
}
