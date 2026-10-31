import { translateUi } from '@/lib/localization';
/**
 * Centralized toast notification helpers
 * Provides consistent toast notifications across the application
 */

import { getApiErrorMessage } from '@/services/api';
import { toast } from 'sonner';
import { logger } from './logger';

export type ToastOptions = {
  duration?: number;
  description?: string;
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  logger.info('Success toast shown', { message });
  toast.success(translateUi(message), options);
};

/**
 * Show error toast
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  console.log('[showErrorToast] Showing error toast:', message);
  logger.error('Error toast shown', { message });
  toast.error(translateUi(message), options);
};

/**
 * Show warning toast
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  logger.warn('Warning toast shown', { message });
  toast.warning(translateUi(message), options);
};

/**
 * Show info toast
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  logger.info('Info toast shown', { message });
  toast.info(translateUi(message), options);
};

/**
 * Show API error toast with automatic error message extraction
 */
export const showApiErrorToast = (error: unknown, defaultMessage = 'Có lỗi xảy ra. Vui lòng thử lại.') => {
  const errorMessage = getApiErrorMessage(error);
  logger.error('API error toast shown', { error, errorMessage });
  toast.error(translateUi(errorMessage || defaultMessage));
};

/**
 * Show success toast for common operations
 */
export const showOperationSuccess = (operation: string) => {
  const messages: Record<string, string> = {
    login: 'Đăng nhập thành công!',
    logout: 'Đăng xuất thành công!',
    register: 'Đăng ký thành công!',
    updateProfile: 'Cập nhật thông tin thành công!',
    changePassword: 'Đổi mật khẩu thành công!',
    createReservation: 'Đặt bàn thành công!',
    cancelReservation: 'Hủy đặt bàn thành công!',
  };

  const message = messages[operation] || `${operation} thành công!`;
  showSuccessToast(message);
};

/**
 * Show error toast for common operations
 */
export const showOperationError = (operation: string, error?: unknown) => {
  const messages: Record<string, string> = {
    login: 'Đăng nhập thất bại',
    logout: 'Đăng xuất thất bại',
    register: 'Đăng ký thất bại',
    updateProfile: 'Cập nhật thông tin thất bại',
    changePassword: 'Đổi mật khẩu thất bại',
    createReservation: 'Đặt bàn thất bại',
    cancelReservation: 'Hủy đặt bàn thất bại',
  };

  const defaultMessage = messages[operation] || `${operation} thất bại`;
  
  if (error) {
    showApiErrorToast(error, defaultMessage);
  } else {
    showErrorToast(defaultMessage);
  }
};
