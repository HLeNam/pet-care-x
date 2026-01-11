import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import appointmentApi from '~/apis/appointment.api';
import { useAppContext } from '~/contexts/app/app.context';
import type { UpdateAppointmentStatusPayload, DeleteAppointmentParams } from '~/types/appointment.type';

interface UseCustomerAppointmentsListParams {
  pageNo?: number;
  pageSize?: number;
}

export const useCustomerAppointmentList = ({ pageNo, pageSize }: UseCustomerAppointmentsListParams) => {
  const { profile } = useAppContext();

  const query = useQuery({
    queryKey: ['customer-appointments', profile?.userId, pageNo, pageSize],
    queryFn: () => {
      return appointmentApi.getCustomerAppointments({
        idKhachHang: profile!.userId,
        pageNo,
        pageSize
      });
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  return {
    appointments: query.data?.data?.data?.items || [],
    pagination: {
      pageNo: query.data?.data?.data?.pageNo || 1,
      pageSize: query.data?.data?.data?.pageSize || 10,
      totalPage: query.data?.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.data?.totalElements || 0
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};

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
