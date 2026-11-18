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

test('updates a booking with a valid auth token', async ({ request }) => {
  const authResponse = await request.post(`${baseUrl}/auth`, {
    data: {
      username: 'admin',
      password: 'password123',
    },
  });

  expect(authResponse.status()).toBe(200);
  const { token } = await authResponse.json();
  expect(token).toEqual(expect.any(String));

  const createResponse = await request.post(`${baseUrl}/booking`, {
    data: booking,
  });

  expect(createResponse.status()).toBe(200);
  const { bookingid } = await createResponse.json();

  const updatedBooking = {
    ...booking,
    firstname: 'Updated',
  };

  const updateResponse = await request.put(
    `${baseUrl}/booking/${bookingid}`,
    {
      headers: {
        Cookie: `token=${token}`,
      },
      data: updatedBooking,
    },
  );

  expect(updateResponse.status()).toBe(200);

  const getResponse = await request.get(
    `${baseUrl}/booking/${bookingid}`,
  );

  expect(getResponse.status()).toBe(200);
  expect(await getResponse.json()).toMatchObject({
    firstname: 'Updated',
    lastname: booking.lastname,
  });
});
