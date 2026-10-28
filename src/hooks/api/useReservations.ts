
import { translateUi } from '@/lib/localization';
/**
 * TanStack Query hooks for reservations
 */

import { reservationService } from '@/services/reservation.service';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreateReservationPayload, Reservation } from '@/types';
import { logger } from '@/utils/logger';
import { showApiErrorToast, showOperationSuccess } from '@/utils/toastHelpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type UseQueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => Promise<unknown>;
};

export const useMyReservations = (isAuthenticated: boolean = true) => {
  const query = useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: () => {
      console.log('[useMyReservations] Fetching reservations...');
      return reservationService.getMyReservations();
    },
    enabled: isAuthenticated,
  });

  console.log('[useMyReservations] Query state:', {
    isAuthenticated,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    data: query.data,
  });

  if (!isAuthenticated) {
    return {
      data: [],
      isLoading: false,
      error: null,
      isFetching: false,
      isSuccess: true,
      isError: false,
      refetch: () => Promise.resolve({ data: [] }),
    } as UseQueryResult<Reservation[]>;
  }

  return query;
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => 
      reservationService.create(payload),
    onSuccess: (data) => {
      logger.info('Reservation created successfully', { reservationId: data.reservation.id });
      showOperationSuccess('createReservation');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error) => {
      logger.error('Reservation creation failed', error);
      showApiErrorToast(error, 'Đặt bàn thất bại');
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      reservationService.cancelReservation(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success(translateUi(t.reservationCancelSuccess));
    },
    onError: (error) => {
      logger.error('Reservation cancellation failed', error);
      showApiErrorToast(error, 'Hủy đặt bàn thất bại');
    },
  });
};

export const useInvalidateReservations = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
  };
};
