import { z } from 'zod';

export const RoleSchema = z.enum([
  'ROLE_ADMIN',
  'ROLE_USER',
  'ROLE_STAFF',
  'ROLE_MANAGER',
  'ROLE_DOCTOR',
  'ROLE_RECEPTIONIST',
  'ROLE_WAREHOUSE',
  'ROLE_CUSTOMER'
]);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  _id: z.string(),
  roles: z.array(RoleSchema),
  email: z.string().email(),
  name: z.string().max(160, 'Name must be at most 160 characters long.').optional(),
  date_of_birth: z.string().optional(),
  address: z.string().max(160, 'Address must be at most 160 characters long.').optional(),
  phone: z.string().max(20, 'Phone number must be at most 20 characters long.').optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number()
});

export const AuthUserSchema = z.object({
  idAccount: z.number(),
  email: z.string().email(),
  userId: z.number(),
  name: z.string().max(160, 'Name must be at most 160 characters long.').optional(),
  date_of_birth: z.string().optional(),
  address: z.string().max(160, 'Address must be at most 160 characters long.').optional(),
  phone: z.string().max(20, 'Phone number must be at most 20 characters long.').optional(),
  roles: z.array(RoleSchema)
});

export const UpdateUserBodySchema = UserSchema.pick({
  name: true,
  date_of_birth: true,
  address: true,
  phone: true
}).extend({
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(160, 'Password must be at most 160 characters long')
    .optional(),
  new_password: z
    .string()
    .nonempty('New password is required')
    .min(6, 'New password must be at least 6 characters long')
    .max(160, 'New password must be at most 160 characters long')
    .optional()
});

export type User = z.infer<typeof UserSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type UserProfile = User;
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
