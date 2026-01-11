import http from '~/utils/http';
import type { ResponseApi } from '~/types/utils.type';
import type {
  CreateMedicalRecordParams,
  CreateMedicalRecordResponse,
  GetDoctorMedicalRecordsResponse,
  GetMedicalRecordParams,
  CreatePrescriptionParams,
  CreatePrescriptionResponse,
  GetPrescriptionsParams,
  GetPrescriptionsResponse,
  GetPrescriptionByMedicalRecordParams,
  PrescriptionDetail
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

const getPrescriptions = (params: GetPrescriptionsParams) => {
  return http.get<ResponseApi<GetPrescriptionsResponse>>('http://localhost:9090/api/v1/prescriptions', {
    params: {
      pageNo: params.pageNo || 0,
      pageSize: params.pageSize || 10,
      sortBy: params.sortBy || 'idToa',
      sortDir: params.sortDir || 'desc'
    }
  });
};

const getPrescriptionByMedicalRecord = (params: GetPrescriptionByMedicalRecordParams) => {
  return http.get<ResponseApi<PrescriptionDetail>>(
    `http://localhost:9090/api/v1/prescriptions/medical-record/${params.idHoSo}`
  );
};

const medicalApi = {
  createMedicalRecord,
  createPrescription,
  getDoctorMedicalRecords,
  getCustomerMedicalRecords,
  getPrescriptions,
  getPrescriptionByMedicalRecord
};

export default medicalApi;
