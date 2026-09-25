/**
 * Centralized constants for the Mix Food application
 * This file consolidates all constants to avoid duplication and improve maintainability
 */

import { GUEST_OPTIONS, INFORMATION_RESTAURANT, SOCIAL_LINKS, THAI_DISHES, TIME_SLOTS } from "@/utils/const";

// Re-export existing constants for backward compatibility
export { GUEST_OPTIONS, INFORMATION_RESTAURANT, SOCIAL_LINKS, THAI_DISHES, TIME_SLOTS };
export { MENU_TAG_PRESENTATIONS } from './menu';
export { PUBLIC_PAGE_METADATA, PUBLIC_ROBOTS, RESTAURANT, SITE } from './site';

// Booking-specific time slots (lunch and dinner service only)
export const BOOKING_TIME_SLOTS = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
] as const;

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "mixfood.access-token",
  REFRESH_TOKEN: "mixfood.refresh-token",
  USER: "mixfood.user",
  LANGUAGE: "lang",
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, ""),
  TIMEOUT: 30000, // 30 seconds
} as const;

// Reservation status configuration
export const RESERVATION_STATUS = {
  PENDING: "PENDING" as const,
  CONFIRMED: "CONFIRMED" as const,
  ARRIVED: "ARRIVED" as const,
  CANCELLED: "CANCELLED" as const,
} as const;

// Status colors for UI
export const STATUS_COLORS = {
  PENDING: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  CONFIRMED: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  ARRIVED: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
  CANCELLED: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
  },
} as const;

// Date formatting options
export const DATE_FORMATS = {
  FULL_DATE: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as const,
  SHORT_DATE: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  } as const,
  TIME: {
    hour: '2-digit',
    minute: '2-digit',
  } as const,
} as const;

// Validation rules
export const VALIDATION = {
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  PASSWORD_MIN_LENGTH: 6,
  VERIFICATION_CODE_LENGTH: 6,
  MAX_GUESTS_PER_RESERVATION: 10,
  MIN_ADVANCE_BOOKING_MINUTES: 30,
} as const;

// Restaurant booking window (24h format, local time).
export const BOOKING_WINDOW = {
  OPEN: "09:00",
  CLOSE: "21:50",
  LAST_BOOKING: "21:50",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "We could not reach the restaurant service. Please try again shortly.",
  SESSION_EXPIRED: "Session expired. Please login again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  VALIDATION_ERROR: "Please fill in all required fields",
} as const;
