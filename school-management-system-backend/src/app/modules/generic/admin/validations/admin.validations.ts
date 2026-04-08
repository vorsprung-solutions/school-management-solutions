import { Types } from 'mongoose';
import { z } from 'zod';

const objectId = z.instanceof(Types.ObjectId);

const adminZodSchema = z.object({
  body: z.object({
    user: objectId,
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
  }),
});

export const createAdminZodSchema = adminZodSchema;
export const updateAdminZodSchema = z.object({
  body: adminZodSchema.shape.body.partial(),
});

// Types
export type AdminInput = z.infer<typeof adminZodSchema>;
export type CreateAdminInput = z.infer<typeof createAdminZodSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminZodSchema>;
