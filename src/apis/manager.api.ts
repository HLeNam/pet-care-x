import type {
  GetAppointmentsByBranchParams,
  GetAppointmentsByBranchResponse,
  GetDoctorAppointmentsResponse,
  GetRevenueByBranchParams,
  GetRevenueByBranchResponse,
  GetSalesRevenueByBranchParams,
  GetSalesRevenueByBranchResponse,
  GetDoctorAppointmentsParams
} from '~/types/manager.type';
import type { ResponseApi } from '~/types/utils.type';
import http from '~/utils/http';

const getRevenueByBranch = (params: GetRevenueByBranchParams) => {
  return http.get<ResponseApi<GetRevenueByBranchResponse>>(`/statistical/revenue-by-branch`, {
    params: {
      ...params
    }
  });
};

const getAppointmentsByBranch = (params: GetAppointmentsByBranchParams) => {
  return http.get<ResponseApi<GetAppointmentsByBranchResponse>>(`/statistical/appointment-by-branch`, {
    params: {
      ...params
    }
  });
};

const getSalesRevenueByBranch = (params: GetSalesRevenueByBranchParams) => {
  return http.get<ResponseApi<GetSalesRevenueByBranchResponse>>(`/statistical/sales-revenue-by-branch`, {
    params: {
      ...params
    }
  });
};

const getDoctorAppointments = (params: GetDoctorAppointmentsParams) => {
  return http.get<ResponseApi<GetDoctorAppointmentsResponse>>(
    `http://localhost:9090/api/v1/statistical/doctors/completed-appointments`,
    {
      params: {
        ...params
      }
    }
  );
};

const managerApi = {
  getRevenueByBranch,
  getAppointmentsByBranch,
  getSalesRevenueByBranch,
  getDoctorAppointments
};

export default managerApi;
