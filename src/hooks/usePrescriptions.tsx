import { useQuery } from '@tanstack/react-query';
import medicalApi from '~/apis/medical.api';
import prescriptionApi from '~/apis/prescription.api';
import type { GetPrescriptionByMedicalRecordIdParams } from '~/types/prescription.type';

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

/**
 * Hook to get prescriptions by medical record ID with pagination
 */
export const usePrescriptionsByMedicalRecordId = (
  params: Omit<GetPrescriptionByMedicalRecordIdParams, 'idHoSo'> & { idHoSo: number | null },
  enabled = true
) => {
  return useQuery({
    queryKey: [
      'prescriptions',
      'medical-record',
      params.idHoSo,
      params.pageNo,
      params.pageSize,
      params.sortBy,
      params.sortDir
    ],
    queryFn: () => prescriptionApi.getPrescriptionByMedicalRecordId(params as GetPrescriptionByMedicalRecordIdParams),
    enabled: enabled && !!params.idHoSo,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
};
