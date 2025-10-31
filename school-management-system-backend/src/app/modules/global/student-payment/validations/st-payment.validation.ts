import { z } from 'zod';
import mongoose from 'mongoose';

export const paymentTypeEnum = z.enum([
  'monthly_fee',
  'exam_fee',
  'form_fillup',
]);
export const paymentStatusEnum = z.enum(['pending', 'paid']);

export const studentPaymentZodSchema = z.object({
  body: z.object({
    student: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid student ObjectId',
    }),
    organization: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid organization ObjectId',
      }),
    name: z.string().min(1, 'Name is required'),
    pay_type: paymentTypeEnum,
    amount: z.number(),
    status: paymentStatusEnum,
    pay_date: z.coerce.date(),
    admit_url: z.string().url().optional(),
  }),
});

export const createStudentPaymentZodSchema = studentPaymentZodSchema;

export const updateStudentPaymentZodSchema = z.object({
  body: studentPaymentZodSchema.shape.body.partial(),
});

export type StudentPaymentInput = z.infer<typeof studentPaymentZodSchema>;
export type CreateStudentPaymentInput = z.infer<
  typeof createStudentPaymentZodSchema
>;
export type UpdateStudentPaymentInput = z.infer<
  typeof updateStudentPaymentZodSchema
>;
