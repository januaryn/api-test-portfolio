import { test, expect } from '@playwright/test';

test('PUT without a token returns 403', async ({ request }) => {
  const response = await request.put('/booking/1', {
    data: { firstname: 'Changed' },
  });
  expect(response.status()).toBe(403);
});
