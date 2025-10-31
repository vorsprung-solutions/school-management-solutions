import {
  createTeacherZodSchema,
  updateTeacherZodSchema,
} from './teacher.validations';

export const TeacherValidations = {
  create: createTeacherZodSchema,
  update: updateTeacherZodSchema,
};
