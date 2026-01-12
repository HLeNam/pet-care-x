export type PrescriptionItemResponse = {
  idSanPham: number;
  tenSanPham: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
};

export type PrescriptionResponse = {
  idToa: number;
  maToa: string;
  thoiGianKham: string;
  idHoSo: number;
  idThuCung: number;
  tenThuCung: string;
  toaSanPhamList: PrescriptionItemResponse[];
};

export type GetPrescriptionByMedicalRecordIdParams = {
  idHoSo: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: keyof PrescriptionResponse;
  sortDir?: 'asc' | 'desc';
};

export type GetPrescriptionByMedicalRecordIdResponse = {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElements: number;
  items: PrescriptionResponse[];
};
