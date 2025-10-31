import { createExamZodSchema, updateExamZodSchema } from './exam.validations';

export const ExamValidations = {
  create: createExamZodSchema,
  update: updateExamZodSchema,
};
