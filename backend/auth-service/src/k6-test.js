import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

const BASE_URL = 'http://auth-service:8081';

export default function () {
  // 1. Register
  const username = `user_${randomString(8)}`;
  const email = `${username}@example.com`;
  const password = 'password123';

  const registerPayload = JSON.stringify({
    username: username,
    email: email,
    password: password,
    fullName: 'Test User',
  });

  const registerRes = http.post(`${BASE_URL}/auth/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'register status is 201': (r) => r.status === 201,
  });

  sleep(1);

  // 2. Login
  const loginPayload = JSON.stringify({
    email: email,
    password: password,
  });

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginSuccess = check(loginRes, {
    'login status is 201': (r) => r.status === 201,
    'has access token': (r) => r.json('accessToken') !== undefined,
  });

  if (loginSuccess) {
    const accessToken = loginRes.json('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    // 3. Get User Info (Self)
    // Assuming the login response or token decoding gives the ID, but for now let's search or use a known endpoint
    // We can't easily get the ID from the login response if it's just a token without decoding it in k6 (which is possible but adds complexity).
    // Let's try to search for the user we just created.

    const searchRes = http.get(`${BASE_URL}/user/search?q=${username}`, {
      headers,
    });
    check(searchRes, {
      'search status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}
