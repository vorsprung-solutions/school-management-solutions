import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../../utils/catchAsynch";
import sendResponse from "../../../../utils/sendResponse";
import { StudentServices } from "../services/student.services";
import httpStatus from "http-status";
import { TImageFile } from "../../../../interface/image.interface";

const getPublicStudents = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await StudentServices.getPublicStudents(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const student = await StudentServices.getSingleStudent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully",
    data: student,
  });
});

const getCurrentStudent = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const student = await StudentServices.getCurrentStudent(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Current student retrieved successfully",
    data: student,
  });
});

const getAllStudents = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const students = await StudentServices.getAllStudents(domain);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully",
    data: students,
  });
});

const getAllStudentsByOrganization = catchAsync(async (req, res) => {
  const { id } = req.params;
  const students = await StudentServices.getAllStudentsByOrganization(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully",
    data: students,
  });
});

const getAllStudentsByCurrentOrganization = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const students = await StudentServices.getAllStudentsByOrganization(user.organization);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully",
    data: students,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const user = req.user;
  const student = await StudentServices.updateStudent(
    user as JwtPayload,
    payload,
    file as TImageFile
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

const updateStudentByAdmin = catchAsync(async (req, res) => {
  const payload = req.body;
  const file = req.file;
  const user = req.user;
  const { id } = req.params;
  const student = await StudentServices.updateStudentByAdmin(
    payload,
    id,
    file as TImageFile
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

const deleteStudentByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const student = await StudentServices.deleteStudentByUserId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student deleted successfully",
    data: student,
  });
});

const blockStudentByUserId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const student = await StudentServices.blockStudentByUserId(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student blocked successfully",
    data: student,
  });
});

const getStudentsByFilters = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const { class: classNumber, session, group } = req.query;
  
  const filters: { class?: number; session?: number; group?: string } = {};
  if (classNumber) filters.class = Number(classNumber);
  if (session) filters.session = Number(session);
  if (group) filters.group = group as string;
  
  const students = await StudentServices.getStudentsByFilters(
    user.organization,
    filters
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully",
    data: students,
  });
});

const getDashboardStats = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const stats = await StudentServices.getDashboardStats(user.organization);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: stats,
  });
});

export const StudentControllers = {
  getPublicStudents,
  getSingleStudent,
  getCurrentStudent,
  getAllStudents,
  getAllStudentsByOrganization,
  getAllStudentsByCurrentOrganization,
  updateStudent,
  updateStudentByAdmin,
  deleteStudentByUserId,
  blockStudentByUserId,
  getStudentsByFilters,
  getDashboardStats,
};
