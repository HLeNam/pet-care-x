import type {
  GetPrescriptionByMedicalRecordIdParams,
  GetPrescriptionByMedicalRecordIdResponse
} from '~/types/prescription.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getPrescriptionByMedicalRecordId = async (params: GetPrescriptionByMedicalRecordIdParams) => {
  return http.get<ResponseApi<GetPrescriptionByMedicalRecordIdResponse>>(`/prescriptions/ho-so/${params.idHoSo}`, {
    params: {
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      sortDir: params.sortDir
    }
  });
};

const prescriptionApi = {
  getPrescriptionByMedicalRecordId
};

export default prescriptionApi;
