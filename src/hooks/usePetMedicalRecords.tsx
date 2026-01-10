import { useQuery } from '@tanstack/react-query';
import petApi from '~/apis/pet.api';

interface UsePetMedicalRecordsParams {
  idThuCung: number | null;
  pageNo?: number;
  pageSize?: number;
  enabled?: boolean;
}

/**
 * Hook để lấy danh sách hồ sơ khám bệnh của thú cưng với pagination
 */
export const usePetMedicalRecords = ({
  idThuCung,
  pageNo = 1,
  pageSize = 10,
  enabled = true
}: UsePetMedicalRecordsParams) => {
  return useQuery({
    queryKey: ['pet-medical-records', idThuCung, pageNo, pageSize],
    queryFn: async () => {
      if (!idThuCung) {
        return {
          items: [],
          pageNo: 1,
          pageSize: 10,
          totalPage: 0,
          totalElements: 0
        };
      }

      const response = await petApi.getPetMedicalRecords({
        idThuCung,
        pageNo,
        pageSize
      });

      return (
        response.data.data || {
          items: [],
          pageNo: 1,
          pageSize: 10,
          totalPage: 0,
          totalElements: 0
        }
      );
    },
    enabled: enabled && !!idThuCung
  });
};
