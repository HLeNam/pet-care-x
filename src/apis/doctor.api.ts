import type { DoctorAppointmentListResponse, GetDoctorAppointmentsParams } from '~/types/employee.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getDoctorAppointments = async (params: GetDoctorAppointmentsParams) => {
  return http.get<ResponseApi<DoctorAppointmentListResponse>>('http://localhost:9090/api/lichhen/bacsi', { params });
};

const doctorApi = {
  getDoctorAppointments
};

export default doctorApi;
