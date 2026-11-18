import { expect, test } from '@playwright/test';

test('POST /booking returns a booking with the expected contract', async ({ request }) => {
  const response = await request.post(
    'https://restful-booker.herokuapp.com/booking',
    {
      data: {
        firstname: 'Contract',
        lastname: 'Test',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2027-06-01',
          checkout: '2027-06-05',
        },
        additionalneeds: 'Breakfast',
      },
    },
  );

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body: unknown = await response.json();

  expect(body).toEqual(
    expect.objectContaining({
      bookingid: expect.any(Number),
      booking: expect.objectContaining({
        firstname: 'Contract',
        lastname: 'Test',
        totalprice: expect.any(Number),
        depositpaid: expect.any(Boolean),
        bookingdates: expect.objectContaining({
          checkin: expect.any(String),
          checkout: expect.any(String),
        }),
      }),
    }),
  );
});
