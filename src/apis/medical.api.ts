import http from '~/utils/http';
import type { ResponseApi } from '~/types/utils.type';
import type {
  CreateMedicalRecordParams,
  CreateMedicalRecordResponse,
  GetDoctorMedicalRecordsResponse,
  GetMedicalRecordParams,
  CreatePrescriptionParams,
  CreatePrescriptionResponse,
  GetPrescriptionByMedicalRecordParams,
  GetPrescriptionsResponse
} from '~/types/medical.type';

const createMedicalRecord = (params: CreateMedicalRecordParams) => {
  return http.post<ResponseApi<CreateMedicalRecordResponse>>('http://localhost:9090/api/hosokhambenh/tao', params);
};

const createPrescription = (params: CreatePrescriptionParams) => {
  return http.post<ResponseApi<CreatePrescriptionResponse>>('http://localhost:9090/api/v1/prescriptions', params);
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

const getPrescriptionByMedicalRecord = (params: GetPrescriptionByMedicalRecordParams) => {
  return http.get<ResponseApi<GetPrescriptionsResponse>>(
    `http://localhost:9090/api/v1/prescriptions/ho-so/${params.idHoSo}`,
    {
      params: {
        pageNo: params.pageNo,
        pageSize: params.pageSize,
        sortBy: params.sortBy,
        sortDir: params.sortDir
      }
    }
  );
};

const medicalApi = {
  createMedicalRecord,
  createPrescription,
  getDoctorMedicalRecords,
  getCustomerMedicalRecords,
  getPrescriptionByMedicalRecord
};

export default medicalApi;
