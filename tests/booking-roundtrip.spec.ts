import { test, expect } from '@playwright/test';
import { postWithRetry } from './helpers/retry';

test('POST then GET returns the same booking data', async ({ request }) => {
  const newBooking = {
    firstname: 'Jane',
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-05',
    },
    additionalneeds: 'Breakfast',
  };

  const createResponse = await postWithRetry(() =>
  request.post('/booking', { data: newBooking })
);

  expect(createResponse.status()).toBe(200);

  const { bookingid, booking } = await createResponse.json();
  expect(bookingid).toBeDefined();
  expect(booking.firstname).toBe(newBooking.firstname);

  const getResponse = await request.get(`/booking/${bookingid}`);
  expect(getResponse.status()).toBe(200);

  const fetched = await getResponse.json();
  expect(fetched.firstname).toBe(newBooking.firstname);
  expect(fetched.lastname).toBe(newBooking.lastname);
  expect(fetched.totalprice).toBe(newBooking.totalprice);
  expect(fetched.depositpaid).toBe(newBooking.depositpaid);
  expect(fetched.bookingdates).toEqual(newBooking.bookingdates);
  expect(fetched.additionalneeds).toBe(newBooking.additionalneeds);
  expect(createResponse.status(), 'POST /booking should succeed').toBe(200);
});
