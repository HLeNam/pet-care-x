export type GetRevenueByBranchParams = {
  startDate: string;
  endDate: string;
};

export type RevenueByBranch = {
  idChiNhanh: number;
  maChiNhanh: string;
  tenChiNhanh: string;
  tongDoanhThuChiNhanh: number;
};

export type GetRevenueByBranchResponse = {
  totalRevenue: number;
  revenueByBranch: RevenueByBranch[];
};

export type GetAppointmentsByBranchParams = {
  startDate: string;
  endDate: string;
};

export type AppointmentsByBranch = {
  idChiNhanh: number;
  maChiNhanh: string;
  tenChiNhanh: string;
  soLichHenDaHoanThanh: number;
};

export type GetAppointmentsByBranchResponse = {
  totalSuccessfulAppointments: number;
  appointmentByBranch: AppointmentsByBranch[];
};

export type GetSalesRevenueByBranchParams = {
  startDate: string;
  endDate: string;
};

export type SalesRevenueByBranch = {
  idChiNhanh: number;
  maChiNhanh: string;
  tenChiNhanh: string;
  tongDoanhThuBanHangChiNhanh: number;
};

export type GetSalesRevenueByBranchResponse = {
  totalSalesRevenue: number;
  salesRevenueByBranch: SalesRevenueByBranch[];
};

export type GetDoctorAppointmentsParams = {
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  topN?: number;
};

export type DoctorAppointmentsItemResponse = {
  doctorId: number;
  doctorName: string;
  branchName: string;
  completedAppointments: number;
};

export type GetDoctorAppointmentsResponse = {
  content: DoctorAppointmentsItemResponse[];
  totalPages: number;
  totalElements: number;
};
