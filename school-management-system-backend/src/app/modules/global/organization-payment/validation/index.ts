import {
  createOrganizationPaymentZodSchema,
  updateOrganizationPaymentZodSchema,
} from './or-payment.validations';

export const OrganizationPaymentValidations = {
  create: createOrganizationPaymentZodSchema,
  update: updateOrganizationPaymentZodSchema,
};
