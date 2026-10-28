import { getUiLocale } from '@/lib/localization';
// ─── Shared helpers for TableOrder pages ──────────────────────────────────────

export const API_BASE =
  import.meta.env.VITE_WS_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3001';

export function formatVND(n: number) {
  return new Intl.NumberFormat(getUiLocale(), { style: 'currency', currency: 'VND' }).format(n);
}

export function generateIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface ApiErrorPayload {
  message?: string;
  code?: string;
  retryAfterSeconds?: number;
  error?: { code?: string };
}

export function getApiError(error: unknown) {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) return {};
  return {
    code: error.response?.data?.error?.code ?? error.response?.data?.code,
    message: error.response?.data?.message,
    status: error.response?.status,
    retryAfterSeconds: error.response?.data?.retryAfterSeconds,
  };
}

// Retained for non-UI consumers and legacy tests. Screen labels are resolved
// from LanguageContext in OrdersPage so they follow the active language.
export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Đang chờ',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chuẩn bị',
  READY: 'Sẵn sàng',
  SERVED: 'Đã phục vụ',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

// Tailwind classes for order status pills + a matching left-border accent,
// mirroring the color language used on the admin side.
export const ORDER_STATUS_STYLE: Record<string, { badge: string; border: string }> = {
  PENDING:   { badge: 'bg-warning/15 text-warning-foreground', border: 'border-l-warning' },
  CONFIRMED: { badge: 'bg-info/15 text-info',                  border: 'border-l-info' },
  PREPARING: { badge: 'bg-primary/10 text-primary',            border: 'border-l-primary' },
  READY:     { badge: 'bg-success/15 text-success',            border: 'border-l-success' },
  SERVED:    { badge: 'bg-accent/15 text-accent',              border: 'border-l-accent' },
  COMPLETED: { badge: 'bg-muted text-muted-foreground',        border: 'border-l-muted-foreground' },
  CANCELLED: { badge: 'bg-destructive/10 text-destructive',    border: 'border-l-destructive' },
};
import axios from 'axios';
