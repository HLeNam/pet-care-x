import type {
  DoctorAvailableListResponse,
  GetDoctorsAvailableParams,
  GetDoctorScheduleParams,
  GetDoctorsByBranchParams,
  DoctorsByBranchListResponse,
  DoctorScheduleItemResponse
} from '~/types/employee.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getDoctorsAvailable = async (params: GetDoctorsAvailableParams) => {
  return http.get<ResponseApi<DoctorAvailableListResponse>>(`http://localhost:9090/api/nhanvien/bacsi/ranh`, {
    params: {
      ...params
    }
  });
};

const getDoctorSchedule = async (params: GetDoctorScheduleParams) => {
  return http.get<ResponseApi<DoctorScheduleItemResponse[]>>(`http://localhost:9090/api/nhanvien/bacsi/lich`, {
    params: {
      ...params
    }
  });
};

const getDoctorsByBranch = async (params: GetDoctorsByBranchParams) => {
  return http.get<ResponseApi<DoctorsByBranchListResponse>>(`http://localhost:9090/api/nhanvien/bacsi/chinhanh`, {
    params: {
      ...params
    }
  });
};

const staffApi = {
  getDoctorsAvailable,
  getDoctorSchedule,
  getDoctorsByBranch
};

export default staffApi;
