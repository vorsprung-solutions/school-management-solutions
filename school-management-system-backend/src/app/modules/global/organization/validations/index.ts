import { createOrganizationZodSchema, updateOrganizationZodSchema } from './organization.validatioins';

export const organizationValidations = {
  create: createOrganizationZodSchema,
  update: updateOrganizationZodSchema,
};
