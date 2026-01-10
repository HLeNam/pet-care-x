import { useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentApi from '~/apis/appointment.api';
import type { CreateAppointmentRequest } from '~/types/employee.type';

/**
 * Hook để tạo lịch hẹn mới
 * Sử dụng useMutation vì đây là thao tác thay đổi dữ liệu (POST)
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentApi.createAppointment(data),
    onSuccess: () => {
      // Có thể invalidate queries liên quan nếu cần
      // queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['doctors-available'] });
    }
  });
};
