import { z } from 'zod';

export const planTypeEnum = z.enum(['monthly', 'lifetime', 'yearly']);
export const subscriptionStatusEnum = z.enum(['active', 'expired']);

export const organizationZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),

    subdomain: z
      .string()
      .min(3, 'Subdomain must be at least 3 characters')
      .regex(
        /^[a-z0-9-]+$/,
        'Subdomain can only contain lowercase letters, numbers and hyphens',
      ),

    customdomain: z.string().optional(),

    logo: z.string().url().optional(),

    email: z.string().email('Invalid email format'),

    phone: z
      .number()
      .int('Phone number must be an integer')
      .min(100000000, 'Phone number must be at least 9 digits'),

    ephone: z
      .number()
      .int('Emergency phone must be an integer')
      .min(100000000, 'Emergency phone must be at least 9 digits')
      .optional(),

    est: z.string().optional(),

    social: z
      .object({
        facebook: z.string().url().optional(),
        youtube: z.string().url().optional(),
        instagram: z.string().url().optional(),
        twitter: z.string().url().optional(),
      })
      .optional(),

    address: z.string().min(1, 'Address is required'),

    plan_type: planTypeEnum,

    subscription_status: subscriptionStatusEnum,

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    expire_at: z.date().optional(),
  }),
});

// Create Schema → omit system-managed fields
export const createOrganizationZodSchema = organizationZodSchema.extend({
  body: organizationZodSchema.shape.body.omit({
    createdAt: true,
    updatedAt: true,
  }),
});

// Update Schema → all fields optional with flexible types
export const updateOrganizationZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    subdomain: z
      .string()
      .min(3, 'Subdomain must be at least 3 characters')
      .regex(
        /^[a-z0-9-]+$/,
        'Subdomain can only contain lowercase letters, numbers and hyphens',
      )
      .optional(),
    customdomain: z.string().optional(),
    logo: z.string().url().optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z
      .union([
        z.number().int('Phone number must be an integer').min(100000000, 'Phone number must be at least 9 digits'),
        z.string().transform((val) => {
          if (!val) return undefined;
          const num = parseInt(val, 10);
          if (isNaN(num)) {
            throw new Error('Phone number must be a valid number');
          }
          if (num < 100000000) {
            throw new Error('Phone number must be at least 9 digits');
          }
          return num;
        })
      ])
      .optional(),
    ephone: z
      .union([
        z.number().int('Emergency phone must be an integer').min(100000000, 'Emergency phone must be at least 9 digits'),
        z.string().transform((val) => {
          if (!val) return undefined;
          const num = parseInt(val, 10);
          if (isNaN(num)) {
            throw new Error('Emergency phone must be a valid number');
          }
          if (num < 100000000) {
            throw new Error('Emergency phone must be at least 9 digits');
          }
          return num;
        })
      ])
      .optional(),
    est: z.string().optional(),
    social: z
      .union([
        z.string().optional(),
        z.object({
          facebook: z.string().optional(),
          youtube: z.string().optional(),
          instagram: z.string().optional(),
          twitter: z.string().optional(),
        }).optional()
      ])
      .optional(),
    address: z.string().min(1, 'Address is required').optional(),
    plan_type: planTypeEnum.optional(),
    subscription_status: subscriptionStatusEnum.optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    expire_at: z.date().optional(),
  }),
});

// Types
export type OrganizationInput = z.infer<typeof organizationZodSchema>;
export type CreateOrganizationInput = z.infer<
  typeof createOrganizationZodSchema
>;
export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationZodSchema
>;
