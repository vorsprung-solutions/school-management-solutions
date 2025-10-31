import { z } from 'zod';
import { Types } from 'mongoose';

// Enum for grades
export const GradeEnum = z.enum(['A+', 'A', 'A-', 'B', 'C', 'D', 'F']);

// ObjectId validation helper
const objectId = z.instanceof(Types.ObjectId);

// Zod schema for result creation
export const resultZodSchema = z.object({
  body: z.object({
    student: objectId,
    exam_name: z.string().min(1, 'Exam name is required'),
    year: z.number().int().min(2000, 'Invalid year'),

    results: z
      .array(
        z.object({
          subject: z.string().min(1, 'Subject is required'),
          marks: z.number().min(0, 'Marks cannot be negative'),
          grade: GradeEnum,
          gpa: z.number().min(0).max(5),
        }),
      )
      .nonempty('At least one result is required'),

    gpa: z.number().min(0).max(5),
    grade: GradeEnum,
    is_passed: z.boolean().optional(),
  }),
});

export const createResultZodSchema = resultZodSchema;

export const updateResultZodSchema = z.object({
  body: resultZodSchema.shape.body.partial(),
});

// Types
export type ResultInput = z.infer<typeof resultZodSchema>;
