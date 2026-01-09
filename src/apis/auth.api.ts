import type { AuthResponse, LoginRequest } from '~/types/auth.type';
import http from '~/utils/http';

const registerAccount = async (body: {
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  password: string;
}) => {
  return http.post<{
    idKhachHang: number;
    maKhachHang: string;
    hoTen: string;
    soDienThoai: string;
    diaChi: string | null;
    account: {
      idAccount: number;
      email: string;
    };
  }>('/auth/register', body);
};

const loginAccount = async (body: LoginRequest) => {
  return http.post<AuthResponse>('/auth/login', body);
};

const logoutAccount = async () => {
  return http.post('/auth/logout');
};

const authApi = {
  registerAccount,
  loginAccount,
  logoutAccount
};

export default authApi;
