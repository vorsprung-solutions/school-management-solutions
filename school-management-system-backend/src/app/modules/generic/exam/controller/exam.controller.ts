import catchAsync from '../../../../utils/catchAsynch';
import sendResponse from '../../../../utils/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ExamServices } from '../services/exam.services';

const createExam = catchAsync(async (req, res) => {
  const exam = req.body;
  const user = req.user;
  const result = await ExamServices.createExam(user as JwtPayload, exam);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam created succesfully!',
    data: result,
  });
});

const getAllExams = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const organization = user?.organization;

  const result = await ExamServices.getAllExams(organization);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exams fetched succesfully!',
    data: result,
  });
});

const getExamsByDomain = catchAsync(async (req, res) => {
  const domain = req?.params?.domain;
  const result = await ExamServices.getExamsByDomain(domain);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exams fetched successfully!',
    data: result,
  });
});

const getSingleExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ExamServices.getSingleExam(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam fetched successfully!',
    data: result,
  });
});

const updateExam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const data = req.body;
  const result = await ExamServices.updateExam(id, user, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam updated successfully!',
    data: result,
  });
});

const deleteExamById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ExamServices.deleteExamById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam deleted successfully!',
    data: result,
  });
});

const restoreExamById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ExamServices.restoreExamById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Exam restored successfully!',
    data: result,
  });
});

export const ExamController = {
  createExam,
  getAllExams,
  getExamsByDomain,
  getSingleExam,
  updateExam,
  deleteExamById,
  restoreExamById,
};
