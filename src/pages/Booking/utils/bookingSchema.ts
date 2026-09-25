import { LucideIcon } from "lucide-react";
import { z } from "zod";
import { BOOKING_WINDOW, VALIDATION } from "@/constants";

export const bookingSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên không được quá 50 ký tự"),
  phone: z.string().regex(/^(0|\+84)[3-9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  date: z.date({
    required_error: "Vui lòng chọn ngày đặt bàn",
  }),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Vui lòng nhập giờ hợp lệ"),
  guests: z.coerce
    .number({ required_error: "Vui lòng nhập số lượng khách", invalid_type_error: "Vui lòng nhập số lượng khách" })
    .int()
    .min(1, "Số lượng khách phải ít nhất 1")
    .max(50, "Số lượng khách tối đa 50"),
  specialRequests: z.string().max(500, "Yêu cầu đặc biệt không được quá 500 ký tự").optional(),
}).refine((data) => {
  // Combine date and time to create full datetime
  const [hours, minutes] = data.time.split(':').map(Number);
  const reservationDateTime = new Date(data.date);
  reservationDateTime.setHours(hours, minutes, 0, 0);
  
  // Check if reservation is at least 30 minutes in the future
  const now = new Date();
  const minTime = new Date(now.getTime() + VALIDATION.MIN_ADVANCE_BOOKING_MINUTES * 60 * 1000);
  
  if (reservationDateTime < minTime) {
    return false;
  }

  const [openingHours, openingMinutes] = BOOKING_WINDOW.OPEN.split(':').map(Number);
  const openingTime = new Date(reservationDateTime);
  openingTime.setHours(openingHours, openingMinutes, 0, 0);

  if (reservationDateTime < openingTime) {
    return false;
  }
  
  // Enforce the restaurant's final booking time.
  const [lastBookingHours, lastBookingMinutes] = BOOKING_WINDOW.LAST_BOOKING.split(':').map(Number);
  const lastBookingTime = new Date(reservationDateTime);
  lastBookingTime.setHours(lastBookingHours, lastBookingMinutes, 0, 0);
  
  if (reservationDateTime > lastBookingTime) {
    return false;
  }
  
  return true;
}, {
  message: `Giờ đặt bàn phải trong khung ${BOOKING_WINDOW.OPEN} - ${BOOKING_WINDOW.LAST_BOOKING} và trước ít nhất ${VALIDATION.MIN_ADVANCE_BOOKING_MINUTES} phút`,
  path: ["time"]
})

export interface IBookingInfo{
  title: string;
  desription: string;
  icon: LucideIcon ;
}

export type BookingFormValues = z.infer<typeof bookingSchema>



