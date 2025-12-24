import type { AuthUser } from '~/types/user.type';
import type { ResponseApi, SuccessResponseApi } from '~/types/utils.type';

export type AuthResponse = ResponseApi<{
  access_token: string;
  expires: number;
  refresh_token: string;
  expires_refresh_token: number;
  user: AuthUser;
}>;

export type AuthSuccessResponse = SuccessResponseApi<{
  access_token: string;
  expires: number;
  refresh_token: string;
  expires_refresh_token: number;
  user: AuthUser;
}>;

export type RefreshTokenResponse = SuccessResponseApi<{
  access_token: string;
}>;
