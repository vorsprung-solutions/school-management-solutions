import { Response } from 'express';
import httpStatus from 'http-status';
type Tresponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
};
const sendResponse = <T>(res: Response, data: Tresponse<T>) => {
  res.status(data?.statusCode).json({
    statusCode: httpStatus.OK,
    success: data.success,
    token: data?.token,
    message: data.message,
    data: data.data,
    meta: data?.meta,
  });
};

export default sendResponse;
