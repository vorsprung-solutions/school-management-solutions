import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import { UserServices } from '../services/user.services';
import httpStatus from 'http-status';

const createStudent = catchAsync(async (req, res) => {
  const user = req.user;
  const student = req.body;
  const file: any = req.file;
  const result = await UserServices.createStudent(
    user as JwtPayload,
    student,
    file,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

const createTeacher = catchAsync(async (req, res) => {
  const user = req.user;
  const teacher = req.body;
  const file: any = req.file;
  const result = await UserServices.createTeacher(
    user as JwtPayload,
    teacher,
    file,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher created successfully',
    data: result,
  });
});

const createStaff = catchAsync(async (req, res) => {
  const user = req.user;
  const staff = req.body;
  const file: any = req.file;
  const result = await UserServices.createStaff(
    user as JwtPayload,
    staff,
    file,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Staff created successfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createTeacher,
  createStaff,
};
