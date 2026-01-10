import { z } from 'zod';

export const MedicalRecordSchema = z.object({
  id: z.number(),
  petName: z.string(),
  date: z.string(),
  doctor: z.string(),
  diagnosis: z.string(),
  treatment: z.string(),
  cost: z.number(),
  symptoms: z.string().optional(),
  prescriptions: z.array(z.string()).optional(),
  nextAppointment: z.string().optional()
});

export type MedicalRecord = z.infer<typeof MedicalRecordSchema>;

export const MedicalRecordFormData = z.object({
  symptoms: z.string().nonempty('Symptoms are required'),
  diagnosis: z.string().nonempty('Diagnosis is required'),
  nextAppointment: z.string().optional()
});

export type MedicalRecordFormData = z.infer<typeof MedicalRecordFormData>;

export type CreateMedicalRecordParams = {
  thoiGianKham: string; // ISO 8601 format: "2026-01-10T14:22:12.731Z"
  idThuCung: number;
  trieuChung: string;
  chuanDoan: string;
  ngayTaiKham: string; // Date format: "2026-01-11"
  idBacSi: number;
};

export type CreateMedicalRecordResponse = {
  status: number;
  message: string;
};

export type GetMedicalRecordParams = {
  userId: number;
  pageNo?: number;
  pageSize?: number;
};

export type GetDoctorMedicalRecordItemResponse = {
  idHoSo: number;
  thoiGianKham: string;
  idThuCung: number;
  tenThuCung: string;
  trieuChung: string;
  chuanDoan: string;
  ngayTaiKham: string | null;
  idBacSi: number;
  giaKham: number;
};

export type GetDoctorMedicalRecordsResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  items: GetDoctorMedicalRecordItemResponse[];
};
