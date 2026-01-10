import type { CreateAppointmentRequest } from '~/types/employee.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const createAppointment = async (body: CreateAppointmentRequest) => {
  return http.post<ResponseApi<unknown>>(`http://localhost:9090/api/lichhen/tao`, body);
};

const appointmentApi = {
  createAppointment
};

export default appointmentApi;
