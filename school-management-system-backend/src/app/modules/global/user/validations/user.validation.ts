import { z } from 'zod';
import { USER_ROLE } from '../user.constance';

export const userZodSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    profilePicture: z.string().optional(),
    role: z
      .enum([
        USER_ROLE.super_admin,
        USER_ROLE.admin,
        USER_ROLE.student,
        USER_ROLE.teacher,
        USER_ROLE.staff,
      ])
      .default(USER_ROLE.student),
    is_deleted: z.boolean().optional().default(false),
    is_blocked: z.boolean().optional().default(false),
  }),
});

export const createUserZodSchema = userZodSchema.extend({
  body: userZodSchema.shape.body.omit({ is_deleted: true, is_blocked: true }),
});

export const updateUserZodSchema = z.object({
  body: userZodSchema.shape.body.partial(),
});

// Types
export type UserInput = z.infer<typeof userZodSchema>;
export type CreateUserInput = z.infer<typeof createUserZodSchema>;
export type UpdateUserInput = z.infer<typeof updateUserZodSchema>;
