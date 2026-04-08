import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import { DepartmentServices } from '../services/department.services';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const createDepartment = catchAsync(async (req, res) => {
  const department = req.body;
  const user = req.user;
  const result = await DepartmentServices.createDepartment(
    user as JwtPayload,
    department,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department created succesfully!',
    data: result,
  });
});

const getAllDepartmentByOrganizationId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DepartmentServices.getAllDepartmentByOrgnazationId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department fetched succesfully!',
    data: result,
  });
});

const getAllDepartment = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const result = await DepartmentServices.getAllDepartment(domain);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department fetched successfully',
    data: result,
  });
});

const getSingleDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DepartmentServices.getSingleDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department fetched successfully!',
    data: result,
  });
});

const updateDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const data = req.body;
  const result = await DepartmentServices.updateDepartment(id, user, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department updated successfully!',
    data: result,
  });
});
const deleteDepartmentyId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DepartmentServices.deleteDepartmentyId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department deleted successfully!',
    data: result,
  });
});

export const DepartmentController = {
  createDepartment,
  getAllDepartmentByOrganizationId,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartmentyId,
};
