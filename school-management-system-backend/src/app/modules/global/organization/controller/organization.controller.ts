import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import { OrganizationServices } from '../services/organization.services';
import httpStatus from 'http-status';
import { TImageFile } from '../../../../interface/image.interface';

const getOrganizationByUser = catchAsync(async (req, res) => {
  const user = req?.user as JwtPayload;
  const result = await OrganizationServices.getOrganizationByUser(user);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Organization retrieved successfully',
    data: result,
  });
});

const getOrganizationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrganizationServices.getOrganizationById(id);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Organization retrieved successfully',
    data: result,
  });
});

const updateOrganization = catchAsync(async (req, res) => {
  const file = req?.file;
  const payload = req.body;
  const user = req?.user as JwtPayload;
  
  const result = await OrganizationServices.updateOrganization(
    user,
    payload,
    file as TImageFile,
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Organization updated successfully',
    data: result,
  });
});

const getOrganizationByDomain = catchAsync(async (req, res) => {
  const { domain } = req.params;
  
  const result = await OrganizationServices.getOrganizationByDomain(domain);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Organization retrieved successfully',
    data: result,
  });
});

export const OrganizationController = {
  getOrganizationByUser,
  getOrganizationById,
  updateOrganization,
  getOrganizationByDomain,
};
