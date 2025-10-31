import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../../../errors/AppError';
import catchAsync from '../../../../utils/catchAsynch';
import httpStatus from 'http-status';
import { TImageFile } from '../../../../interface/image.interface';
import sendResponse from '../../../../utils/sendResponse';
import { AboutServices } from '../services/about.services';

const createAbout = catchAsync(async (req, res) => {
  const file = req?.file;
  const payload = req.body;
  const user = req?.user as JwtPayload;
  
  const result = await AboutServices.createAboutIntoDb(
    file as TImageFile,
    user,
    payload,
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About created successfully',
    data: result,
  });
});

const getAbout = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const result = await AboutServices.getAbout(domain);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About fetched successfully',
    data: result,
  });
});

const getAboutByOrganization = catchAsync(async (req, res) => {
  const user = req?.user as JwtPayload;
  const result = await AboutServices.getAboutByOrganization(user.organization);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About fetched successfully',
    data: result,
  });
});

const updateAbout = catchAsync(async (req, res) => {
  const file = req?.file;
  const payload = req.body;
  const user = req?.user as JwtPayload;
  
  const result = await AboutServices.updateAbout(
    user,
    payload,
    file as TImageFile,
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About updated successfully',
    data: result,
  });
});

const deleteAbout = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AboutServices.deleteAbout(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About deleted successfully',
    data: result,
  });
});

export const AboutController = {
  createAbout,
  getAbout,
  getAboutByOrganization,
  updateAbout,
  deleteAbout,
};
