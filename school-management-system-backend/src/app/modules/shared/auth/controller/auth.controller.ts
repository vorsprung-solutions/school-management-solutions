import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import { AuthServices } from '../services/auth.services';
import httpStatus from 'http-status';
import AppError from '../../../../errors/AppError';
import { TImageFile } from '../../../../interface/image.interface';

const createOrganization = catchAsync(async (req, res) => {
  const file = req?.file;
  const organization = req.body;
  const result = await AuthServices.createOrganization(
    file as TImageFile,
    organization,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'School Website created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.loginUser(payload);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });

  const data = {
    accessToken,
    needsPasswordChange,
  };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: data,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userData = req.user;
  const payload = req.body;
  await AuthServices.changePassword(userData as JwtPayload, payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link sent to your email',
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Token is required for password reset',
    );
  }
  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset succesfully!',
    data: result,
  });
});

export const AuthController = {
  createOrganization,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
