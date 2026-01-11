import { useQuery } from '@tanstack/react-query';
import medicalApi from '~/apis/medical.api';

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
