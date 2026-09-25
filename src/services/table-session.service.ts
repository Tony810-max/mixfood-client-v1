/**
 * Table Session Service
 *
 * All requests use the session token from TableSessionContext,
 * NOT from authStorage (which is for logged-in user accounts).
 *
 * The session token is passed as the Authorization Bearer header.
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

function sessionApi(token: string) {
  return axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ScanResponse {
  sessionToken: string;
  session: {
    id: string;
    status: string;
    openedAt: string;
    expiresAt: string;
  };
  table: {
    id: number;
    tableNumber: string;
    name?: string;
    capacity: number;
    status: string;
  };
  menu: Array<{
    id: number;
    name: { en: string; vn: string };
    products: Array<{
      id: number;
      name: { en: string; vn: string };
      price: number;
      tags?: string[];
      image?: string;
      isActive: boolean;
    }>;
  }>;
  currentOrders: OrderResponse[];
  currentTotal: number;
}

export interface OrderItemInput {
  productId: number;
  quantity: number;
  notes?: string;
}

export interface OrderResponse {
  id: number;
  status: string;
  orderSource: string;
  subtotal: number;
  total: number;
  notes?: string;
  createdAt: string;
  items: Array<{
    id: number;
    productNameSnapshot: { en: string; vn: string };
    priceSnapshot: number;
    quantity: number;
    subtotal: number;
    notes?: string;
    status: string;
  }>;
}

export interface MessageResponse {
  id: number;
  senderType: 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'SYSTEM';
  message: string;
  status: string;
  createdAt: string;
}

export interface SendMessageResponse {
  customerMessage: MessageResponse;
  chatbotMessage?: MessageResponse;
}

export interface StaffCallResponse {
  id: number;
  type: string;
  status: string;
  createdAt: string;
  isReminder?: boolean;
}

export interface PaymentRequestResponse {
  id: number;
  status: string;
  amount: number;
  requestedAt: string;
}

// ─── API functions ──────────────────────────────────────────────────────────

/** Scan QR code — no session token needed for this endpoint. */
export async function scanQrCode(token: string): Promise<ScanResponse> {
  const res = await axios.get(`${API_BASE}/q/${token}`);
  return res.data;
}

/** Get current session state (for page refresh). */
export async function getSessionState(sessionToken: string) {
  const api = sessionApi(sessionToken);
  const res = await api.get('/customer/session');
  return res.data;
}

/** Get menu. */
export async function getMenu(sessionToken: string) {
  const api = sessionApi(sessionToken);
  const res = await api.get('/customer/menu');
  return res.data;
}

/** Submit an order. */
export async function createOrder(
  sessionToken: string,
  items: OrderItemInput[],
  notes?: string,
  idempotencyKey?: string,
): Promise<OrderResponse> {
  const api = sessionApi(sessionToken);
  const headers: Record<string, string> = {};
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const res = await api.post('/customer/orders', { items, notes }, { headers });
  return res.data;
}

/** Cancel your own order — only allowed while it's still PENDING. */
export async function cancelOrder(sessionToken: string, orderId: number): Promise<OrderResponse> {
  const api = sessionApi(sessionToken);
  const res = await api.post(`/customer/orders/${orderId}/cancel`);
  return res.data;
}

/** Get current orders. */
export async function getOrders(sessionToken: string): Promise<OrderResponse[]> {
  const api = sessionApi(sessionToken);
  const res = await api.get('/customer/orders');
  return res.data;
}

/** Send message to restaurant. */
export async function sendMessage(sessionToken: string, message: string): Promise<SendMessageResponse> {
  const api = sessionApi(sessionToken);
  const res = await api.post('/customer/messages', { message });
  return res.data;
}

/** Chatbot conversations are deliberately not persisted. */
export async function getChatbotReply(sessionToken: string, message: string): Promise<{ message: string }> {
  const api = sessionApi(sessionToken);
  const res = await api.post('/customer/chatbot/reply', { message });
  return res.data;
}

/** Get messages for session. */
export async function getMessages(sessionToken: string): Promise<{ data: MessageResponse[] }> {
  const api = sessionApi(sessionToken);
  const res = await api.get('/customer/messages?limit=100');
  return res.data;
}

/** Call staff. */
export async function callStaff(
  sessionToken: string,
  type: string,
): Promise<StaffCallResponse> {
  const api = sessionApi(sessionToken);
  const res = await api.post('/customer/staff-calls', { type });
  return res.data;
}

/** Get staff calls. */
export async function getStaffCalls(sessionToken: string): Promise<StaffCallResponse[]> {
  const api = sessionApi(sessionToken);
  const res = await api.get('/customer/staff-calls');
  return res.data;
}

/** Request payment. */
export async function requestPayment(sessionToken: string): Promise<PaymentRequestResponse> {
  const api = sessionApi(sessionToken);
  const res = await api.post('/customer/payment-requests');
  return res.data;
}

/** Get payment status. */
export async function getPaymentStatus(sessionToken: string): Promise<PaymentRequestResponse[]> {
  const api = sessionApi(sessionToken);
  const res = await api.get('/customer/payment');
  return res.data;
}
