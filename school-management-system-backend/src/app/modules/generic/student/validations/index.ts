import {
  createStudentZodSchema,
  updateStudentZodSchema,
} from './student.validations';

export const StudentValidations = {
  create: createStudentZodSchema,
  update: updateStudentZodSchema,
};
