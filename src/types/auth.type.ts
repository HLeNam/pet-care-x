import { z } from 'zod';

export type AuthResponse = {
  idAccount: number;
  email: string;
  userId: number;
  accessToken: string;
  roles: {
    idRole: number;
    roleName: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_STAFF' | 'ROLE_MANAGER';
    description: string;
  }[];
};

export type AuthSuccessResponse = {
  idAccount: number;
  email: string;
  userId: number;
  accessToken: string;
  roles: {
    idRole: number;
    roleName: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_STAFF' | 'ROLE_MANAGER';
    description: string;
  }[];
};

export type RefreshTokenResponse = {
  idAccount: number;
  email: string;
  userId: number;
  accessToken: string;
  roles: {
    idRole: number;
    roleName: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_STAFF' | 'ROLE_MANAGER';
    description: string;
  }[];
};

export const RegisterFormSchema = z
  .object({
    name: z.string().nonempty('Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .nonempty('Mobile number is required')
      .refine(
        (value) => {
          const isMobile = /^[0-9]{10,11}$/.test(value.replace(/\s/g, ''));
          return isMobile;
        },
        { message: 'Please enter a valid mobile number' }
      ),
    password: z
      .string()
      .nonempty('Password is required')
      .min(3, 'Password must be at least 3 characters')
      .max(160, 'Password must be at most 160 characters'),
    confirmPassword: z.string().nonempty('Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const LoginFormSchema = z.object({
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
  password: z.string().nonempty('Password is required').min(3, 'Password must be at least 3 characters'),
  rememberMe: z.boolean().optional()
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;

export type LoginRequest = Omit<LoginFormData, 'rememberMe'>;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
