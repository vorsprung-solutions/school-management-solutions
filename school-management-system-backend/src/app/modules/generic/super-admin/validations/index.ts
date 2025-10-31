import {
  createSuperAdminZodSchema,
  updateSuperAdminZodSchema,
} from './super-admin.valildations';

export const SupderAdminValidations = {
  create: createSuperAdminZodSchema,
  update: updateSuperAdminZodSchema,
};
