import {
  createResultZodSchema,
  updateResultZodSchema,
} from './result.validation';

export const ResultValidatoin = {
  create: createResultZodSchema,
  update: updateResultZodSchema,
};
