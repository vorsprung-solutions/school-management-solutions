import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ResultServices } from '../services/result.services';

const createResult = catchAsync(async (req, res) => {
  const resultData = req.body;
  const user = req.user;
  const result = await ResultServices.createResult(user as JwtPayload, resultData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Result created successfully!',
    data: result,
  });
});

const getAllResults = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const organization = user?.organization;
  const filters = req.query;

  const result = await ResultServices.getAllResults(organization, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Results fetched successfully!',
    data: result,
  });
});

const getResultsByDomain = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const filters = req.query;

  const result = await ResultServices.getResultsByDomain(domain, filters);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Results fetched successfully!',
    data: result,
  });
});

const getSingleResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ResultServices.getSingleResult(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result fetched successfully!',
    data: result,
  });
});

const updateResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const data = req.body;
  const result = await ResultServices.updateResult(id, user, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result updated successfully!',
    data: result,
  });
});

const deleteResultById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ResultServices.deleteResultById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result deleted successfully!',
    data: result,
  });
});

const getResultsByStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const user = req.user as JwtPayload;
  const organization = user?.organization;

  const result = await ResultServices.getResultsByStudent(studentId, organization);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student results fetched successfully!',
    data: result,
  });
});

const getMyResults = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const userId = user?.id;

  const result = await ResultServices.getMyResults(userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your results fetched successfully!',
    data: result,
  });
});

const getResultsByExam = catchAsync(async (req, res) => {
  const { examId } = req.params;
  const user = req.user as JwtPayload;
  const organization = user?.organization;

  const result = await ResultServices.getResultsByExam(examId, organization);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam results fetched successfully!',
    data: result,
  });
});

const getResultStatistics = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const organization = user?.organization;

  const result = await ResultServices.getResultStatistics(organization);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result statistics fetched successfully!',
    data: result,
  });
});

export const ResultController = {
  createResult,
  getAllResults,
  getResultsByDomain,
  getSingleResult,
  updateResult,
  deleteResultById,
  getResultsByStudent,
  getMyResults,
  getResultsByExam,
  getResultStatistics,
};
