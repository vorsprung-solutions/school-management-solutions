import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: '',

      message: err.message,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: err.message,
    errorSources,
  };
};
