import {
  createAboutZodSchema,
  updateAboutZodSchema,
} from './about.validations';

export const AboutValidations = {
  create: createAboutZodSchema,
  update: updateAboutZodSchema,
};
