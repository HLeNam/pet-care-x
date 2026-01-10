import { useQuery } from '@tanstack/react-query';
import doctorApi from '~/apis/doctor.api';
import { useAppContext } from '~/contexts';

interface UseDoctorAppointmentsListParams {
  pageNo?: number;
  pageSize?: number;
}

export const useDoctorAppointmentsList = ({ pageNo = 1, pageSize = 10 }: UseDoctorAppointmentsListParams = {}) => {
  const { profile } = useAppContext();

  const query = useQuery({
    queryKey: ['doctor-appointments', profile?.userId, pageNo, pageSize],
    queryFn: () =>
      doctorApi.getDoctorAppointments({
        idNhanVien: profile?.userId || 0,
        pageNo,
        pageSize
      }),
    enabled: !!profile?.userId,
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
