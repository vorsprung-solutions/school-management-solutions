import { z } from 'zod';
import mongoose, { Types } from 'mongoose';

const subscriptionStatusEnum = z.enum(['monthly', 'lifetime']);
const payStatusEnum = z.enum(['pending', 'paid']);
const objectId = z.instanceof(Types.ObjectId);

export const organizationPaymentZodSchema = z.object({
  body: z.object({
    organization: objectId,
    subscription_status: subscriptionStatusEnum,
    amount: z.number(),
    pay_status: payStatusEnum,
    pay_date: z.coerce.date(),
    expire_at: z.coerce.date(),
  }),
});

export const createOrganizationPaymentZodSchema = organizationPaymentZodSchema;

export const updateOrganizationPaymentZodSchema = z.object({
  body: organizationPaymentZodSchema.shape.body.partial(),
});

// Types
export type OrganizationPaymentInput = z.infer<
  typeof organizationPaymentZodSchema
>;
export type CreateOrganizationPaymentInput = z.infer<
  typeof createOrganizationPaymentZodSchema
>;
export type UpdateOrganizationPaymentInput = z.infer<
  typeof updateOrganizationPaymentZodSchema
>;
