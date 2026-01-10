import type { CreateAppointmentParams, CreateAppointmentResponse } from '~/types/booking.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const createAppointment = async (params: CreateAppointmentParams) => {
  return http.post<ResponseApi<CreateAppointmentResponse>>(`http://localhost:9090/api/lichhen/tao`, params);
};

const appointmentApi = {
  createAppointment
};

export default appointmentApi;
