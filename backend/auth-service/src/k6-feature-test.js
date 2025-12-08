import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  testCreatePost();
  testGetPosts();
  testLikePost();
  testGetUserProfile();
}

function testCreatePost() {
  http.post(
    'http://post-service:8081/posts',
    JSON.stringify({
      content: 'Hello world',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

function testGetPosts() {
  http.get('http://post-service:8081/posts');
}

function testLikePost() {
  http.post(
    'http://post-service:8081/like',
    JSON.stringify({
      postId: '123',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}

function testGetUserProfile() {
  http.get('http://user-service:3000/users/123');
}
