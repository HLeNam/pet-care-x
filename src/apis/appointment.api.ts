import type { DeleteAppointmentParams, UpdateAppointmentStatusPayload } from '~/types/appointment.type';
import type { CreateAppointmentRequest } from '~/types/employee.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const createAppointment = async (body: CreateAppointmentRequest) => {
  return http.post<ResponseApi<unknown>>(`http://localhost:9090/api/lichhen/tao`, body);
};

const updateAppointmentStatus = async (body: UpdateAppointmentStatusPayload) => {
  return http.put<ResponseApi<unknown>>(`http://localhost:9090/api/lichhen/capnhat-trangthai`, body);
};

const deleteAppointment = async (params: DeleteAppointmentParams) => {
  return http.delete<ResponseApi<unknown>>(`http://localhost:9090/api/lichhen/xoa/${params.idLichHen}`);
};

const appointmentApi = {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
};

export default appointmentApi;
