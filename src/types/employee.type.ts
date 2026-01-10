import z from 'zod';

export const Employee = z.object({
  employee_id: z.number(),
  employee_code: z.string(),
  name: z.string(),
  gender: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
  position: z.number().optional(),
  branch_id: z.number().optional()
});

export type Employee = z.infer<typeof Employee>;

export type GetDoctorsAvailableParams = {
  idChiNhanh: number;
  ngayHen: string;
  gioBatDau: string;
  pageNo?: number;
  pageSize?: number;
};

export type DoctorAvailableItemResponse = {
  idBacSi: number;
  tenBacSi: string;
};

export type DoctorAvailableListResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: DoctorAvailableItemResponse[];
};

export type GetDoctorScheduleParams = {
  idBacSi: number;
  idChiNhanh: number;
  pageNo?: number;
  pageSize?: number;
};

export type DoctorScheduleTimeSlot = {
  gioBatDau: string;
  gioKetThuc: string;
  available: boolean;
};

export type DoctorScheduleItemResponse = {
  date: string;
  timeSlots: DoctorScheduleTimeSlot[];
};

export type DoctorScheduleListResponse = {
  items: DoctorScheduleItemResponse[];
};

export type GetDoctorsByBranchParams = {
  idChiNhanh: number;
  pageNo?: number;
  pageSize?: number;
};

export type DoctorByBranchItemResponse = {
  idBacSi: number;
  tenBacSi: string;
};

export type DoctorsByBranchListResponse = {
  idBacSi: number;
  tenBacSi: number;
};

export type CreateAppointmentRequest = {
  idChiNhanh: number;
  tenChiNhanh: string;
  idKhachHang: number;
  tenKhachHang: string;
  idThuCung: number;
  tenThuCung: string;
  ngayHen: string;
  gioBatDau: string;
  idNhanVien: number;
  tenBacSi: string;
};

export type GetDoctorAppointmentsParams = {
  idNhanVien: number;
  pageNo?: number;
  pageSize?: number;
};

export type DoctorAppointmentItemResponse = {
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

export type DoctorAppointmentListResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: DoctorAppointmentItemResponse[];
};
