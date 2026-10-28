import { getUiLocale } from '@/lib/localization';
/**
 * Menu utility functions
 * 
 * This file contains utility functions for menu-related operations.
 * Static menu data has been removed in favor of API-based data fetching.
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat(getUiLocale(), {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
