export type GetCustomerByPhoneParams = {
  phoneNumber?: string;
};

export type GetCustomerByPhoneResponse = {
  idKhachHang: number;
  maKhachHang: string;
  cccd: string;
  hoTen: string;
  soDienThoai: string;
  tongChiTieuNamNay: number;
  gioiTinh: string;
  ngaySinh: string;
  diemLoyalty: number;
};
