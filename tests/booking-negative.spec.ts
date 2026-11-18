import { test, expect } from '@playwright/test';
import { postWithRetry } from './helpers/retry';
import { incompleteBookings } from './data/bookings';

for (const { name, payload } of incompleteBookings) {
  test(`${name} returns 500 (current API behavior)`, async ({ request }) => {
    const response = await postWithRetry(() =>
      request.post('/booking', { data: payload })
    );
    expect(response.status()).toBe(500);
  });
}
