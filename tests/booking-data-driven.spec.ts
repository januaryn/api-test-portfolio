import { test, expect } from '@playwright/test';
import { postWithRetry } from './helpers/retry';
import { validBookings } from './data/bookings';

for (const { name, payload } of validBookings) {
  test(`create then fetch: ${name}`, async ({ request }) => {
    const createResponse = await postWithRetry(() =>
      request.post('/booking', { data: payload })
    );
    expect(createResponse.status()).toBe(200);

    const { bookingid, booking } = await createResponse.json();
    expect(bookingid).toEqual(expect.any(Number));
    expect(booking).toMatchObject(payload);

    const getResponse = await request.get(`/booking/${bookingid}`);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(payload);
  });
}
