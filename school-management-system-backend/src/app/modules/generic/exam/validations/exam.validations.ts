import { z } from 'zod';

export const createExamZodSchema = z.object({
  examName: z.string().min(1, 'Exam name is required').min(3, 'Exam name must be at least 3 characters'),
});

export const updateExamZodSchema = z.object({
  examName: z.string().min(1, 'Exam name is required').min(3, 'Exam name must be at least 3 characters').optional(),
});

export type CreateExamInput = z.infer<typeof createExamZodSchema>;
export type UpdateExamInput = z.infer<typeof updateExamZodSchema>;
