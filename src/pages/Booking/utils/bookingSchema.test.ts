import { describe, expect, it } from 'vitest';
import { bookingSchema } from './bookingSchema';

const futureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  date.setHours(0, 0, 0, 0);
  return date;
};

const validBooking = (time: string) => ({
  name: 'Nguyen Van A',
  phone: '0905473728',
  email: 'guest@example.com',
  date: futureDate(),
  time,
  guests: 2,
  specialRequests: '',
});

describe('bookingSchema operating hours', () => {
  it.each(['09:00', '21:50'])('accepts boundary time %s', (time) => {
    expect(bookingSchema.safeParse(validBooking(time)).success).toBe(true);
  });

  it.each(['08:59', '21:51'])('rejects time outside operating hours: %s', (time) => {
    expect(bookingSchema.safeParse(validBooking(time)).success).toBe(false);
  });

  it.each(['', '9:00', '12:60', 'invalid'])('rejects malformed time: %s', (time) => {
    expect(bookingSchema.safeParse(validBooking(time)).success).toBe(false);
  });
});
