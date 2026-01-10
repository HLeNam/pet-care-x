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
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: DoctorByBranchItemResponse[];
};
