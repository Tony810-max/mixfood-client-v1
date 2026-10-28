import { translateUi } from '@/lib/localization';
import { API_CONFIG, ERROR_MESSAGES } from "@/constants";
import { ApiError, ApiRequestOptions } from "@/types";

const API_BASE_URL = API_CONFIG.BASE_URL;

const getErrorMessage = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return ERROR_MESSAGES.GENERIC_ERROR;
  }

  const message = (payload as { message?: unknown }).message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return typeof message === "string" ? message : ERROR_MESSAGES.GENERIC_ERROR;
};

export async function apiRequest<T>(
  path: string,
  { body, headers, ...options }: ApiRequestOptions = {},
): Promise<T> {
  // Import authService inside function to avoid circular dependency
  const { authService } = await import("./auth.service");
  
  const token = authService.getAccessToken();
  
  const makeRequest = async (accessToken?: string) => {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };

    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    return response;
  };

  let response = await makeRequest(token);
  const responseBody = await response.json().catch(() => null);

  // If 401 Unauthorized and we have a token, try to refresh
  // Skip token refresh for auth endpoints (login, register, etc.) to avoid redirecting on invalid credentials
  if (response.status === 401 && token && !path.includes('/auth/')) {
    try {
      const newToken = await authService.refreshAccessToken();
      response = await makeRequest(newToken);
      // Parse new response body
      const newResponseBody = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(newResponseBody), response.status);
      }

      return newResponseBody as T;
    } catch (refreshError) {
      // Refresh failed, clear session and redirect to login
      authService.clearSession();
      // Only redirect if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError("Session expired. Please login again.", 401);
    }
  }

  if (!response.ok) {
    throw new ApiError(getErrorMessage(responseBody), response.status);
  }

  return responseBody as T;
}

const rawApiErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Try to extract message from axios error
  if (error && typeof error === 'object') {
    const axiosError = error as { message?: string; response?: { data?: { message?: string | string[] } } };
    const message = axiosError.message || axiosError.response?.data?.message;

    if (message) {
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      return message;
    }
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
};

export function getApiErrorMessage(error: unknown): string { return translateUi(rawApiErrorMessage(error)); }
