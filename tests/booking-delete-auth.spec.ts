import { expect, test } from '@playwright/test';

const baseUrl = 'https://restful-booker.herokuapp.com';

const booking = {
  firstname: 'Alex',
  lastname: 'Morgan',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2027-06-01',
    checkout: '2027-06-05',
  },
  additionalneeds: 'Breakfast',
};

test('deletes a booking with a valid auth token', async ({ request }) => {
  const authResponse = await request.post(`${baseUrl}/auth`, {
    data: { username: 'admin', password: 'password123' },
  });

  expect(authResponse.status()).toBe(200);
  const { token } = await authResponse.json();

  const createResponse = await request.post(`${baseUrl}/booking`, {
    data: booking,
  });

  expect(createResponse.status()).toBe(200);
  const { bookingid } = await createResponse.json();

  const deleteResponse = await request.delete(
    `${baseUrl}/booking/${bookingid}`,
    { headers: { Cookie: `token=${token}` } },
  );

  expect(deleteResponse.status()).toBe(201);

  const getResponse = await request.get(
    `${baseUrl}/booking/${bookingid}`,
  );

  expect(getResponse.status()).toBe(404);
});
