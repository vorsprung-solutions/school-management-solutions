import { createUserZodSchema } from './user.validation';

export const userValidations = {
  create: createUserZodSchema,
};
