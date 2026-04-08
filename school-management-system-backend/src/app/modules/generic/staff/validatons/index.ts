import { createStaffZodSchema, updateStaffZodSchema } from './staff.validation';

export const StaffValidations = {
  create: createStaffZodSchema,
  update: updateStaffZodSchema,
};
