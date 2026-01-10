export type Order = {
  idHoaDon: number;
  maHoaDon: string;
  ngayLap: string;
  tongTien: number;
  khuyenMai: number;
  tienThanhToan: number;
  hinhThucThanhToan: string;
  trangThai: string;
  tenNguoiNhan: string;
  soDienThoaiNguoiNhan: string;
  diaChiGiaoHang: string;
  ghiChu: string;
  idChiNhanh: number;
  tenChiNhanh: string;
  chiTietMuaHang: {
    maHoaDonMuaHang: string;
    idSanPham: string;
    tenSanPham: string;
    loaiSanPham: string;
    giaBan: string;
    hanSuDung: string;
    hinhAnh: string;
    soLuongMua: number;
    donGia: number;
    thanhTien: number;
  }[];
};

export type OrderItemRequest = {
  idSanPham: number;
  soLuong: number;
};

export type OrderRequest = {
  chitietMuaHang: OrderItemRequest[];
  idChiNhanh: number;
  hinhThucThanhToan: string;
  tenNguoiNhan: string;
  soDienThoaiNguoiNhan: string;
  diaChiGiaoHang: string;
  ghiChu: string;
};

export type OrderResponse = Order;
