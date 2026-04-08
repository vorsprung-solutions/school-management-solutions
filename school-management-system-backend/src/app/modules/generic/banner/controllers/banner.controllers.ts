import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../../../errors/AppError';
import catchAsync from '../../../../utils/catchAsynch';
import httpStatus from 'http-status';
import { BannerServices } from '../services/banner.services';
import { TImageFile } from '../../../../interface/image.interface';
import sendResponse from '../../../../utils/sendResponse';

const createBanner = catchAsync(async (req, res) => {
  const file = req?.file;
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please provide a photo');
  }

  const payload = {
    ...req.body,
  };

  const user = req?.user as JwtPayload;
  const result = await BannerServices.createBannerIntoDb(
    file as TImageFile,
    user,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner created successfully',
    data: result,
  });
});

const getAllBanner = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const result = await BannerServices.getAllBanner(domain);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner fetched successfully',
    data: result,
  });
});

const getBannerById = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await BannerServices.getBannerById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner fetched successfully',
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const file = req?.file;
  const { id } = req.params;
  const payload = {
    ...req.body,
  };
  const user = req?.user as JwtPayload;
  const result = await BannerServices.updateBanner(
    file as TImageFile,
    user,
    payload,
    id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
});

const deleteBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BannerServices.deleteBanner(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
});

export const BannerController = {
  createBanner,
  getAllBanner,
  deleteBanner,
  getBannerById,
  updateBanner,
};
