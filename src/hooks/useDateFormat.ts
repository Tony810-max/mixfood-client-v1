import { getUiLocale } from '@/lib/localization';
/**
 * Custom hook for date formatting
 * Provides consistent date formatting across the application
 */

import { useMemo } from 'react';
import { DATE_FORMATS } from '@/constants';

export const useDateFormat = () => {
  const formatDate = useMemo(() => {
    return (date: string | Date, format: keyof typeof DATE_FORMATS = 'FULL_DATE', locale: string = getUiLocale()) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString(locale, DATE_FORMATS[format]);
    };
  }, []);

  const formatTime = useMemo(() => {
    return (time: string) => {
      // Handle time format "HH:MM"
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    };
  }, []);

  const formatDateTime = useMemo(() => {
    return (date: string | Date, locale: string = getUiLocale()) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString(locale, {
        ...DATE_FORMATS.FULL_DATE,
        ...DATE_FORMATS.TIME,
      });
    };
  }, []);

  const isToday = useMemo(() => {
    return (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const today = new Date();
      return dateObj.toDateString() === today.toDateString();
    };
  }, []);

  const isFutureDate = useMemo(() => {
    return (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj > new Date();
    };
  }, []);

  const isPastDate = useMemo(() => {
    return (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj < new Date();
    };
  }, []);

  return {
    formatDate,
    formatTime,
    formatDateTime,
    isToday,
    isFutureDate,
    isPastDate,
  };
};