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

// "idChiNhanh": 0,
// "tenChiNhanh": "string",
// "idKhachHang": 0,
// "tenKhachHang": "string",
// "idThuCung": 0,
// "tenThuCung": "string",
// "ngayHen": "2026-01-10",
// "gioBatDau": {
//   "hour": 0,
//   "minute": 0,
//   "second": 0,
//   "nano": 0
// },
// "idNhanVien": 0,
// "tenBacSi": "string"

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
