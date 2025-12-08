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

const BASE_URL = 'http://message-service:8093';

export default function () {
  const userId = 'user_' + randomString(8);
  const otherUserId = 'user_' + randomString(8);

  // 1. Create Conversation
  const createConvPayload = JSON.stringify({
    participants: [userId, otherUserId],
    isGroup: false,
    creatorId: userId,
  });

  const createConvRes = http.post(
    `${BASE_URL}/conversation/create`,
    createConvPayload,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  check(createConvRes, {
    'create conversation status is 201': (r) => r.status === 201,
  });

  let convId = createConvRes.json('id') || createConvRes.json('_id');

  sleep(1);

  if (convId) {
    // 2. Send Message
    const messagePayload = JSON.stringify({
      conversationId: convId,
      senderId: userId,
      content: 'Hello there!',
      type: 'text',
    });

    const messageRes = http.post(
      `${BASE_URL}/messages/create`,
      messagePayload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    check(messageRes, {
      'send message status is 201': (r) => r.status === 201,
    });

    let messageId = messageRes.json('id') || messageRes.json('_id');

    sleep(1);

    // 3. Get Messages
    const getMessagesRes = http.get(
      `${BASE_URL}/messages/${convId}?userId=${userId}`,
    );
    check(getMessagesRes, {
      'get messages status is 200': (r) => r.status === 200,
    });

    if (messageId) {
      // 4. React to Message
      const reactPayload = JSON.stringify({
        messageId: messageId,
        userId: otherUserId,
        react: 'like',
      });

      const reactRes = http.patch(`${BASE_URL}/messages/react`, reactPayload, {
        headers: { 'Content-Type': 'application/json' },
      });

      check(reactRes, {
        'react message status is 200': (r) => r.status === 200,
      });
    }
  }
}
