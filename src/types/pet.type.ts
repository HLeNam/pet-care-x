import z from 'zod';

export const PetSchema = z.object({
  pet_id: z.number(),
  pet_code: z.string(),
  name: z.string(),
  species: z.string(),
  breed: z.string(),
  gender: z.enum(['Male', 'Female']),
  birth_date: z.string(),
  health_status: z.string(),
  owner_id: z.number()
});

export type Pet = z.infer<typeof PetSchema>;

// Form schemas for better UX
export const PetFormSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50, 'Pet name must be at most 50 characters'),
  species: z.string(),
  breed: z.string().min(1, 'Breed is required').max(50, 'Breed must be at most 50 characters'),
  gender: z.enum(['Male', 'Female']),
  birth_date: z.string().date(),
  health_status: z.string()
});

export type PetFormInput = z.input<typeof PetFormSchema>;

export type GetPetsByOwnerIdParams = {
  idKhachHang: number;
  pageNo?: number;
  pageSize?: number;
};

export type GetPetsByOwnerIdItemResponse = {
  idThuCung: number;
  maThuCung: string;
  ten: string;
};

export type GetPetsByOwnerIdResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: GetPetsByOwnerIdItemResponse[];
};

export type GetPetDetailParams = {
  idThuCung: number;
};

export type GetPetDetailResponse = {
  idThuCung: number;
  maThuCung: string;
  ten: string;
  loai: string;
  giong: string;
  gioiTinh: string;
  ngaySinh: string;
  tinhTrangSucKhoe: string;
  idChu: number | null;
};

export type GetPetMedicalRecordsParams = {
  idThuCung: number;
  pageNo?: number;
  pageSize?: number;
};

//  "idHoSo": 13,
//         "thoiGianKham": "2025-12-10T14:20:00",
//         "idThuCung": 13,
//         "trieuChung": "Nôn dịch vàng",
//         "chuanDoan": "Viêm dạ dày",
//         "ngayTaiKham": "2025-12-13",
//         "idBacSi": 9
export type GetPetMedicalRecordItemResponse = {
  idHoSo: number;
  thoiGianKham: string;
  idThuCung: number;
  trieuChung: string;
  chuanDoan: string;
  ngayTaiKham: string | null;
  idBacSi: number;
  tenBacSi: string | null;
};

export type GetPetMedicalRecordsResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: GetPetMedicalRecordItemResponse[];
};
