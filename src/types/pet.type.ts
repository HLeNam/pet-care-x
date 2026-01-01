import z from "zod";

export const PetSchema = z.object({
  idThuCung: z.number(),
  maThuCung: z.string(),
  ten: z.string(),
  loai: z.string(),
  giong: z.string().optional(),
  gioiTinh: z.enum(['Male', 'Female', 'Other']).optional(),
  ngaySinh: z.string().optional(),
  tinhTrangSucKhoe: z.string().optional(),
  chu: z.number()
});

export type Pet = z.infer<typeof PetSchema>;