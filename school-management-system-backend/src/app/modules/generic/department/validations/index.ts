import {
  createDepartmentZodSchema,
  updateDepartmentZodSchema,
} from './department.validations';

export const DepartmentValidations = {
  create: createDepartmentZodSchema,
  update: updateDepartmentZodSchema,
};
