import type {
  CustomerAppointmentListResponse,
  DeleteAppointmentParams,
  GetCustomerAppointmentsParams,
  UpdateAppointmentStatusPayload
} from '~/types/appointment.type';
import type { CreateAppointmentRequest } from '~/types/employee.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

export const getCustomerAppointments = async (params: GetCustomerAppointmentsParams) => {
  return http.get<ResponseApi<CustomerAppointmentListResponse>>(`http://localhost:9090/api/lichhen/khachhang`, {
    params: {
      ...params
    }
  });
};

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
  getCustomerAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
};

export default appointmentApi;
