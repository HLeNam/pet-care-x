import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import appointmentApi from '~/apis/appointment.api';
import type { UpdateAppointmentStatusPayload, DeleteAppointmentParams } from '~/types/appointment.type';

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAppointmentStatusPayload) => appointmentApi.updateAppointmentStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
      toast.success('Appointment status updated successfully!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update appointment status!');
    }
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteAppointmentParams) => appointmentApi.deleteAppointment(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
      toast.success('Appointment deleted successfully!');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete appointment!');
    }
  });
};
