import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../utils/catchAsynch';
import { AttendanceServices } from '../services/attendance.services';
import sendResponse from '../../../../utils/sendResponse';
import httpStatus from 'http-status';
import { IAttendanceQuery } from '../interface/attendance.interface';

const createAttendance = catchAsync(async (req, res) => {
  const attendance = req.body;
  const user = req.user;
  
  const result = await AttendanceServices.createAttendance(
    user as JwtPayload,
    attendance,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance created successfully!',
    data: result,
  });
});

const getAllAttendance = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const query = req.query as IAttendanceQuery;
  
  const result = await AttendanceServices.getAllAttendanceWithPagination(user, query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getAttendanceByStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const query = req.query as IAttendanceQuery;
  const result = await AttendanceServices.getAttendanceByStudent(studentId, query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student attendance retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getMyAttendance = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const query = req.query as IAttendanceQuery;
  const result = await AttendanceServices.getMyAttendance(user, query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your attendance retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getAttendanceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AttendanceServices.getAttendanceById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance retrieved successfully',
    data: result,
  });
});

const getAttendanceByOrganization = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AttendanceServices.getAttendanceByOrganization(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance fetched successfully!',
    data: result,
  });
});

const updateAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const payload = req.body;
  const result = await AttendanceServices.updateAttendance(
    user as JwtPayload,
    id,
    payload,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance updated successfully!',
    data: result,
  });
});

const deleteAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await AttendanceServices.deleteAttendance(user, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance deleted successfully',
    data: result,
  });
});

const getAttendanceStats = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const query = req.query as IAttendanceQuery;
  
  const result = await AttendanceServices.getAttendanceStats(user, query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance statistics retrieved successfully',
    data: result,
  });
});

const getStudentsForAttendance = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await AttendanceServices.getStudentsForAttendance(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully for attendance',
    data: result,
  });
});

export const AttendanceControllers = {
  createAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  getMyAttendance,
  getAttendanceById,
  getAttendanceByOrganization,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
  getStudentsForAttendance,
};
