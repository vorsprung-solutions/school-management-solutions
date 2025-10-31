import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import { TeacherServices } from '../services/teacher.services';
import httpStatus from 'http-status';
import { TImageFile } from '../../../../interface/image.interface';

const getSingleTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const teacher = await TeacherServices.getSingleTeacher(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher retrieved successfully',
    data: teacher,
  });
});

const getCurrentTeacher = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const teacher = await TeacherServices.getCurrentTeacher(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher retrieved successfully',
    data: teacher,
  });
});

const getAllTeachers = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const student = await TeacherServices.getAllTeachers(domain);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher retrieved successfully',
    data: student,
  });
});

const getAllTeacherByOrganization = catchAsync(async (req, res) => {
  const { id } = req.params;
  const student = await TeacherServices.getAllTeachersByOrganization(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher retrieved successfully',
    data: student,
  });
});

const updateTeacher = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const user = req.user;
  const student = await TeacherServices.updateTeacher(
    user as JwtPayload,
    payload,
    file as TImageFile,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher updated successfully',
    data: student,
  });
});

const updateTeacherByAdmin = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const { id } = req.params;
  const student = await TeacherServices.updateTeacherByAdmin(
    payload,
    id,
    file as TImageFile,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher updated successfully',
    data: student,
  });
});

const deleteTeacherByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const teacher = await TeacherServices.deleteTeacherByUserId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher deleted successfully',
    data: teacher,
  });
});
const blockTeacherByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const teacher = await TeacherServices.blockTeacherByUserId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher blocked successfully',
    data: teacher,
  });
});

export const TeacherControllers = {
  getSingleTeacher,
  getCurrentTeacher,
  getAllTeachers,
  getAllTeacherByOrganization,
  updateTeacher,
  updateTeacherByAdmin,
  deleteTeacherByUserId,
  blockTeacherByUserId,
};
