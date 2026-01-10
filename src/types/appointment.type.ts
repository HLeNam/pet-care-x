export type GetCustomerAppointmentsParams = {
  idKhachHang: number;
  pageNo?: number;
  pageSize?: number;
};

export type CustomerAppointmentItemResponse = {
  idLichHen: number;
  idNhanVien: number;
  tenBacSi: string;
  idThuCung: number | null;
  tenThuCung: string | null;
  idKhachHang: number | null;
  tenKhachHang: string | null;
  idChiNhanh: number;
  tenChiNhanh: string | null;
  ngayHen: string;
  gioBatDau: string;
  gioKetThuc: string;
  trangThai: string;
};

export type CustomerAppointmentListResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: CustomerAppointmentItemResponse[];
};

export type UpdateAppointmentStatusPayload = {
  idLichHen: number;
  trangThai: string;
};

export type DeleteAppointmentParams = {
  idLichHen: number;
};
