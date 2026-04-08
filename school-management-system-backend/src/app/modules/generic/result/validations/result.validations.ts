import { z } from 'zod';

// Grade enum validation
const GradeEnum = z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']);

// Subject result validation
const SubjectResultSchema = z.object({
  subject: z.string().min(1, 'Subject name is required'),
  marks: z.number().min(0, 'Marks must be non-negative').max(100, 'Marks cannot exceed 100'),
  grade: GradeEnum,
  gpa: z.number().min(0, 'GPA must be non-negative').max(5, 'Subject GPA cannot exceed 5'),
});

// Create result validation
export const createResultZodSchema = z.object({
  exam: z.string().min(1, 'Exam ID is required'),
  student: z.string().min(1, 'Student ID is required'),
  year: z.number().min(2000, 'Year must be 2000 or later').max(2100, 'Year cannot exceed 2100'),
  class: z.number().min(1, 'Class must be at least 1').max(12, 'Class cannot exceed 12'),
  session: z.number().min(1, 'Session must be at least 1'),
  group: z.string().optional(),
  results: z.array(SubjectResultSchema).min(1, 'At least one subject result is required'),
  total_marks: z.number().min(0, 'Total marks must be non-negative').optional(),
  gpa: z.number().min(0, 'GPA must be non-negative').max(5, 'Overall GPA cannot exceed 5').optional(),
  grade: GradeEnum.optional(),
  is_passed: z.boolean().optional(),
});

// Update result validation
export const updateResultZodSchema = z.object({
  exam: z.string().min(1, 'Exam ID is required').optional(),
  student: z.string().min(1, 'Student ID is required').optional(),
  year: z.number().min(2000, 'Year must be 2000 or later').max(2100, 'Year cannot exceed 2100').optional(),
  class: z.number().min(1, 'Class must be at least 1').max(12, 'Class cannot exceed 12').optional(),
  session: z.number().min(1, 'Session must be at least 1').optional(),
  group: z.string().optional(),
  results: z.array(SubjectResultSchema).min(1, 'At least one subject result is required').optional(),
  total_marks: z.number().min(0, 'Total marks must be non-negative').optional(),
  gpa: z.number().min(0, 'GPA must be non-negative').max(5, 'Overall GPA cannot exceed 5').optional(),
  grade: GradeEnum.optional(),
  is_passed: z.boolean().optional(),
});

// Public result search validation
export const publicResultSearchZodSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  exam: z.string().min(1, 'Exam name is required'),
  class: z.string().min(1, 'Class is required'),
  session: z.string().min(1, 'Session is required'),
  department: z.string().optional(),
});

export type CreateResultInput = z.infer<typeof createResultZodSchema>;
export type UpdateResultInput = z.infer<typeof updateResultZodSchema>;
export type PublicResultSearchInput = z.infer<typeof publicResultSearchZodSchema>;
