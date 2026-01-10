import type { DoctorAvailableListResponse, GetDoctorsAvailableParams } from '~/types/employee.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getDoctorsAvailable = async (params: GetDoctorsAvailableParams) => {
  return http.get<ResponseApi<DoctorAvailableListResponse>>(`http://localhost:9090/api/nhanvien/bacsi/ranh`, {
    params: {
      ...params
    }
  });
};

const staffApi = {
  getDoctorsAvailable
};

export default staffApi;
