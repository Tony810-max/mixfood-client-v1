/**
 * Centralized type definitions for the Mix Food application
 * This file contains all shared interfaces and types to avoid duplication
 */

// User & Auth Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  code: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Reservation Types
export interface CreateReservationPayload {
  name: string;
  phone: string;
  email?: string;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  note?: string;
  userId?: number;
}

export interface ReservationResponse {
  message: string;
  reservation: {
    id: number;
    status: ReservationStatus;
  };
}

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: number;
  note: string | null;
  status: ReservationStatus;
  rejectionReason: string | null;
  cancelledBy: {
    name: string;
    role: "USER" | "ADMIN";
  } | null;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "ARRIVED" | "CANCELLED";

// Menu Types
export interface MenuItem {
  id: number;
  name: {
    en: string;
    vn: string;
  };
  price: number;
  image: string | null;
  tags?: MenuItemTag[];
}

export type MenuItemTag =
  | "signature"
  | "spicy"
  | "recommended"
  | "vegetarian"
  | "gluten-free"
  | "chefs-special";

export interface Category {
  id: string;
  en: string;
  vn: string;
  items: MenuItem[];
}

// API Types
export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Storage Types
export type StorageLocation = "local" | "session";

// Restaurant Info Types
export interface RestaurantInfo {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface BookingRule {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface GuestOption {
  value: string;
  label: string;
}
