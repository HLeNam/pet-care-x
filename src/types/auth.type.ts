import { z } from 'zod';
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

export const RegisterFormSchema = z
  .object({
    name: z.string().nonempty('Name is required').min(2, 'Name must be at least 2 characters'),
    mobileOrEmail: z
      .string()
      .nonempty('Mobile number or email is required')
      .refine(
        (value) => {
          const isEmail = /\S+@\S+\.\S+/.test(value);
          const isMobile = /^[0-9]{10,11}$/.test(value.replace(/\s/g, ''));
          return isEmail || isMobile;
        },
        { message: 'Please enter a valid email or mobile number' }
      ),
    password: z
      .string()
      .nonempty('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(160, 'Password must be at most 160 characters'),
    confirmPassword: z.string().nonempty('Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const LoginFormSchema = z.object({
  email: z.string().nonempty('Email is required').email('Email is invalid'),
  password: z.string().nonempty('Password is required').min(6, 'Password must be at least 6 characters')
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
