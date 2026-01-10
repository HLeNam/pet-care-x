import { useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentApi from '~/apis/appointment.api';
import type { CreateAppointmentParams } from '~/types/booking.type';

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateAppointmentParams) => appointmentApi.createAppointment(params),
    onSuccess: () => {
      // Invalidate relevant queries after successful appointment creation
      queryClient.invalidateQueries({ queryKey: ['doctor-schedule'] });
      queryClient.invalidateQueries({ queryKey: ['doctors-available'] });
    }
  });
};
