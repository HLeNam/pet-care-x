import http from '~/utils/http';
import type { ResponseApi } from '~/types/utils.type';
import type {
  CreateMedicalRecordParams,
  CreateMedicalRecordResponse,
  GetDoctorMedicalRecordsResponse,
  GetMedicalRecordParams
} from '~/types/medical.type';

const createMedicalRecord = (params: CreateMedicalRecordParams) => {
  return http.post<ResponseApi<CreateMedicalRecordResponse>>('http://localhost:9090/api/hosokhambenh/tao', params);
};

const getDoctorMedicalRecords = (params: GetMedicalRecordParams) => {
  return http.get<ResponseApi<GetDoctorMedicalRecordsResponse>>(
    `http://localhost:9090/api/hosokhambenh/bacsi/${params.userId}`,
    {
      params: {
        pageNo: params.pageNo,
        pageSize: params.pageSize
      }
    }
  );
};

const getCustomerMedicalRecords = (params: GetMedicalRecordParams) => {
  return http.get<ResponseApi<GetDoctorMedicalRecordsResponse>>(
    `http://localhost:9090/api/hosokhambenh/khachhang/${params.userId}`,
    {
      params: {
        pageNo: params.pageNo,
        pageSize: params.pageSize
      }
    }
  );
};

const medicalApi = {
  createMedicalRecord,
  getDoctorMedicalRecords,
  getCustomerMedicalRecords
};

export default medicalApi;
