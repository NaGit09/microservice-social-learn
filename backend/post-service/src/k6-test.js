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

const BASE_URL = 'http://post-service:8087';

export default function () {
  const userId = 'user_' + randomString(8); // Simulate a user ID

  // 1. Create Post
  const createPayload = JSON.stringify({
    content: `This is a test post by ${userId}`,
    authorId: userId, // Assuming DTO might need this or it's extracted from token.
    // If token is needed, we might need to mock it or login.
    // For now, sending as body if service accepts it.
    images: [],
  });

  const createRes = http.post(`${BASE_URL}/post`, createPayload, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId, // simulating a header that gateway might pass
    },
  });

  check(createRes, {
    'create post status is 201': (r) => r.status === 201,
  });

  let postId = createRes.json('id') || createRes.json('_id');

  sleep(1);

  // 2. Get Random Posts
  const randomRes = http.get(`${BASE_URL}/post/random/5`);
  check(randomRes, {
    'get random posts status is 200': (r) => r.status === 200,
  });

  // If we didn't get an ID from create, try to pick one from random
  if (!postId && randomRes.json().length > 0) {
    postId = randomRes.json()[0].id || randomRes.json()[0]._id;
  }

  if (postId) {
    // 3. Like Post
    const likePayload = JSON.stringify({
      targetId: postId,
      targetType: 'post',
      userId: userId,
    });

    const likeRes = http.post(`${BASE_URL}/likes`, likePayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(likeRes, {
      'like post status is 201': (r) => r.status === 201,
    });

    // 4. Comment on Post
    const commentPayload = JSON.stringify({
      postId: postId,
      content: 'Nice post!',
      authorId: userId,
    });

    const commentRes = http.post(`${BASE_URL}/comment`, commentPayload, {
      headers: { 'Content-Type': 'application/json' },
    });

    check(commentRes, {
      'comment status is 201': (r) => r.status === 201,
    });
  }

  sleep(1);
}
