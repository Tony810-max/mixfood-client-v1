import { getUiLocale } from '@/lib/localization';
/**
 * Utility functions for formatting various data types
 * Provides consistent formatting across the application
 */

import { logger } from './logger';

/**
 * Format phone number by removing all non-digit characters
 */
export const formatPhoneNumber = (value: string): string => {
  try {
    return value.replace(/\D/g, '');
  } catch (error) {
    logger.error('Failed to format phone number', error);
    return value;
  }
};

/**
 * Format verification code by removing all non-digit characters
 */
export const formatVerificationCode = (value: string): string => {
  try {
    return value.replace(/\D/g, '');
  } catch (error) {
    logger.error('Failed to format verification code', error);
    return value;
  }
};

/**
 * Format currency in VND
 */
export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat(getUiLocale(), {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  } catch (error) {
    logger.error('Failed to format currency', error);
    return `${amount} đ`;
  }
};

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => {
  try {
    return new Intl.NumberFormat(getUiLocale()).format(value);
  } catch (error) {
    logger.error('Failed to format number', error);
    return String(value);
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter of string
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  try {
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  } catch (error) {
    logger.error('Failed to format file size', error);
    return `${bytes} Bytes`;
  }
};
