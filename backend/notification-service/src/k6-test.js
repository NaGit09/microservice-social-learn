import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://notification-service:8084';

export default function () {
  const userId = 'user_' + randomString(8);

  // 1. Get Notifications
  const getRes = http.get(`${BASE_URL}/notification/${userId}?page=1&size=10`);
  check(getRes, {
    'get notifications status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
