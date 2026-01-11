import { useMutation, useQueryClient } from '@tanstack/react-query';
import medicalApi from '~/apis/medical.api';
import type { CreateMedicalRecordParams, CreatePrescriptionParams } from '~/types/medical.type';

/**
 * Hook to create a new medical record
 * Invalidates pet medical records queries on success
 */
export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateMedicalRecordParams) => medicalApi.createMedicalRecord(params),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch medical records for this pet
      queryClient.invalidateQueries({ queryKey: ['pet-medical-records', variables.idThuCung] });
      queryClient.invalidateQueries({ queryKey: ['doctorMedicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['customerMedicalRecords'] });
    }
  });
};

/**
 * Hook to create a prescription for a medical record
 * Invalidates medical records queries on success
 */
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreatePrescriptionParams) => medicalApi.createPrescription(params),
    onSuccess: (_data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['pet-medical-records', variables.idThuCung] });
      queryClient.invalidateQueries({ queryKey: ['doctorMedicalRecords'] });
      queryClient.invalidateQueries({ queryKey: ['customerMedicalRecords'] });
    }
  });
};
