import { useQuery } from '@tanstack/react-query';
import medicalApi from '~/apis/medical.api';
import type { MedicalRecord } from '~/types/medical.type';
import { useAppContext } from '~/contexts';

interface UseMedicalRecordParams {
  userId?: number;
  pageNo?: number;
  pageSize?: number;
}

/**
 * Hook để lấy danh sách medical records của bác sĩ
 * Tự động parse và transform data sang MedicalRecord type
 */
export const useDoctorMedicalList = ({ userId, pageNo = 1, pageSize = 10 }: UseMedicalRecordParams = {}) => {
  const { profile } = useAppContext();

  const query = useQuery({
    queryKey: ['doctorMedicalRecords', userId, pageNo, pageSize],
    queryFn: () => medicalApi.getDoctorMedicalRecords({ userId: userId || 0, pageNo, pageSize }),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // Cache 2 minutes
    gcTime: 5 * 60 * 1000 // Keep cache 5 minutes
  });

  // Transform API response to MedicalRecord type
  const medicalRecords: MedicalRecord[] = (query.data?.data?.data?.items || []).map((record) => ({
    id: record.idHoSo,
    date: record.thoiGianKham,
    petName: record.tenThuCung,
    doctor: profile?.name || record.tenBacSi || 'Unknown',
    symptoms: record.trieuChung,
    diagnosis: record.chuanDoan,
    treatment: '', // Not provided by API
    cost: record.giaKham, // Not provided by API
    prescriptions: [], // Not provided by API
    nextAppointment: record.ngayTaiKham || undefined
  }));

  const pagination = {
    pageNo: query.data?.data?.data?.pageNo || pageNo,
    pageSize: query.data?.data?.data?.pageSize || pageSize,
    totalPage: query.data?.data?.data?.totalPage || 0,
    totalElements: query.data?.data?.data?.totalElements || 0
  };

  return {
    medicalRecords,
    pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};

export const useCustomerMedicalList = ({ userId, pageNo = 1, pageSize = 10 }: UseMedicalRecordParams = {}) => {
  const { profile } = useAppContext();

  const query = useQuery({
    queryKey: ['customerMedicalRecords', userId, pageNo, pageSize],
    queryFn: () => medicalApi.getCustomerMedicalRecords({ userId: userId || 0, pageNo, pageSize }),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // Cache 2 minutes
    gcTime: 5 * 60 * 1000 // Keep cache 5 minutes
  });

  // Transform API response to MedicalRecord type
  const medicalRecords: MedicalRecord[] = (query.data?.data?.data?.items || []).map((record) => ({
    id: record.idHoSo,
    date: record.thoiGianKham,
    petName: record.tenThuCung,
    doctor: profile?.name || record.tenBacSi || 'Unknown',
    symptoms: record.trieuChung,
    diagnosis: record.chuanDoan,
    treatment: '', // Not provided by API
    cost: record.giaKham, // Not provided by API
    prescriptions: [], // Not provided by API
    nextAppointment: record.ngayTaiKham || undefined
  }));

  const pagination = {
    pageNo: query.data?.data?.data?.pageNo || pageNo,
    pageSize: query.data?.data?.data?.pageSize || pageSize,
    totalPage: query.data?.data?.data?.totalPage || 0,
    totalElements: query.data?.data?.data?.totalElements || 0
  };

  return {
    medicalRecords,
    pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};
