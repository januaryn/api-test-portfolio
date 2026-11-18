export const validBookings = [
  {
    name: 'standard booking with breakfast',
    payload: {
      firstname: 'Jane',
      lastname: 'Tester',
      totalprice: 150,
      depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
      additionalneeds: 'Breakfast',
    },
  },
  {
    name: 'booking without extras',
    payload: {
      firstname: 'Sam',
      lastname: 'Example',
      totalprice: 90,
      depositpaid: false,
      bookingdates: { checkin: '2026-12-10', checkout: '2026-12-12' },
      additionalneeds: 'None',
    },
  },
];
