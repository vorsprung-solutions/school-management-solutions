import {
  createStudentPaymentZodSchema,
  updateStudentPaymentZodSchema,
} from './st-payment.validation';

export const StudentPaymentValidations = {
  create: createStudentPaymentZodSchema,
  update: updateStudentPaymentZodSchema,
};
