import {
  createAdminZodSchema,
  updateAdminZodSchema,
} from './admin.validations';

export const AdminValidations = {
  create: createAdminZodSchema,
  update: updateAdminZodSchema,
};
