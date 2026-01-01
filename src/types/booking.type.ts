import { z } from 'zod';

export const BranchSchema = z.object({
  idChiNhanh: z.number(),
  maChiNhanh: z.string(),
  tenChiNhanh: z.string(),
  diaChi: z.string(),
  soDienThoai: z.string(),
  gioMoCua: z.string(),
  gioDongCua: z.string()
});

export const AppointmentSchema = z.object({
  idLichHen: z.number(),
  idNhanVien: z.number(),
  idThuCung: z.number(),
  idKhachHang: z.number(),
  idChiNhanh: z.number(),
  thoiGianHen: z.string(),
  trangThai: z.string(),
  tenThuCung: z.string().optional(),
  tenBacSi: z.string().optional(),
  tenChiNhanh: z.string().optional()
});

export const BookingFormSchema = z.object({
  idChiNhanh: z.number().min(1, 'Vui lòng chọn chi nhánh'),
  idThuCung: z.number().min(1, 'Vui lòng chọn thú cưng'),
  idNhanVien: z.number().min(1, 'Vui lòng chọn bác sĩ'),
  ngayKham: z.string().nonempty('Vui lòng chọn ngày khám'),
  gioKham: z.string().nonempty('Vui lòng chọn giờ khám')
});

export type Branch = z.infer<typeof BranchSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type BookingForm = z.infer<typeof BookingFormSchema>;
