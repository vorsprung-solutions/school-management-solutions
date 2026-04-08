import { z } from 'zod';

export const aboutZodSchema = z.object({
  body: z.object({
    description: z.string().optional(),
    stats: z.object({
      student: z.string().optional(),
      teacher: z.string().optional(),
      year: z.string().optional(),
      passPercentage: z.string().optional(),
    }).optional(),
    mapUrl: z.string().url().optional(),
    ejpublickey: z.string().optional(),
    ejservicekey: z.string().optional(),
    ejtemplateid: z.string().optional(),
  }),
});

export const createAboutZodSchema = aboutZodSchema;

export const updateAboutZodSchema = z.object({
  body: aboutZodSchema.shape.body.partial(),
});

// Types
export type AboutInput = z.infer<typeof aboutZodSchema>;
export type CreateAboutInput = z.infer<typeof createAboutZodSchema>;
export type UpdateAboutInput = z.infer<typeof updateAboutZodSchema>;
