import z from "zod";

export const DoctorSchema = z.object({
  idNhanVien: z.number(),
  maNhanVien: z.string(),
  hoTen: z.string(),
  gioiTinh: z.enum(['Nam', 'Nữ', 'Khác']).optional(),
  chucVu: z.number().optional(),
  chiNhanh: z.number().optional()
});

export type Doctor = z.infer<typeof DoctorSchema>;