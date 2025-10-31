import { z } from 'zod';

// Teacher Zod Schema
export const teacherZodSchema = z.object({
  body: z.object({
    department: z.string().min(1, 'Department ID is required'),

    name: z.string().min(1, 'Name is required'),

    email: z.string().email('Invalid email format').min(1, 'Email is required'),

    phone: z.union([z.string(), z.number()]).optional(),

    ephone: z.union([z.string(), z.number()]).optional(),

    profilePicture: z.string().url().optional(),

    qualification: z.string().optional(),

    quote: z.string().optional(),

    designation: z.string().optional(),

    join_date: z.string().optional(),

    blood_group: z.string().optional(),
  }),
});

// Create → same as teacher schema (timestamps auto-handled by mongoose)
export const createTeacherZodSchema = teacherZodSchema;

// Update → all fields optional
export const updateTeacherZodSchema = z.object({
  body: teacherZodSchema.shape.body.partial(),
});

// Types
export type TeacherInput = z.infer<typeof teacherZodSchema>;
export type CreateTeacherInput = z.infer<typeof createTeacherZodSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherZodSchema>;
