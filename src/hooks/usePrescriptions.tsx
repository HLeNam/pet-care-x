import { useQuery } from '@tanstack/react-query';
import medicalApi from '~/apis/medical.api';
import type { GetPrescriptionsParams } from '~/types/medical.type';

interface UsePrescriptionsParams extends GetPrescriptionsParams {
  enabled?: boolean;
}

/**
 * Hook to get list of prescriptions with pagination
 */
export const usePrescriptions = ({
  pageNo = 0,
  pageSize = 10,
  sortBy = 'idToa',
  sortDir = 'desc',
  enabled = true
}: UsePrescriptionsParams = {}) => {
  const query = useQuery({
    queryKey: ['prescriptions', pageNo, pageSize, sortBy, sortDir],
    queryFn: () => medicalApi.getPrescriptions({ pageNo, pageSize, sortBy, sortDir }),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache 2 minutes
    gcTime: 5 * 60 * 1000 // Keep cache 5 minutes
  });

  return {
    prescriptions: query.data?.data?.data?.items || [],
    pagination: {
      pageNo: query.data?.data?.data?.pageNo || pageNo,
      pageSize: query.data?.data?.data?.pageSize || pageSize,
      totalPage: query.data?.data?.data?.totalPage || 0,
      totalElements: query.data?.data?.data?.totalElements || 0
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};

/**
 * Hook to get prescription by medical record ID
 */
export const usePrescriptionByMedicalRecord = (idHoSo: number | null, enabled = true) => {
  return useQuery({
    queryKey: ['prescription', 'medical-record', idHoSo],
    queryFn: () => medicalApi.getPrescriptionByMedicalRecord({ idHoSo: idHoSo! }),
    enabled: enabled && !!idHoSo,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
};
