import { JwtPayload } from 'jsonwebtoken';
import { IExam } from './../interface/exam.interface';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';
import { Exam } from '../repository/schema/exam.schema';

const createExam = async (user: JwtPayload, exam: IExam) => {
  const { examName } = exam;
  const { organization } = user;
  
  const existingOrganization = await Organization.findById(organization);
  if (!existingOrganization) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  // Check if exam with same name exists in the organization (not deleted)
  const isExamExists = await Exam.findOne({
    examName,
    organization,
    isDeleted: false,
  });

  if (isExamExists) {
    throw new AppError(httpStatus.CONFLICT, 'Exam with this name already exists in your organization');
  }

  const payload = {
    examName,
    domain: existingOrganization?.customdomain,
    subdomain: existingOrganization?.subdomain,
    organization,
  };

  const newExam = await Exam.create(payload);

  return newExam;
};

const getAllExams = async (organization?: string) => {
  try {
    const matchQuery: any = {};

    // Always filter by organization if provided
    if (organization) {
      matchQuery.organization = organization;
    }

    const documents = await Exam.find(matchQuery)
      .sort({ createdAt: -1 })
      .lean();

    return { exams: documents, count: documents.length };
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch exams');
  }
};

const getExamsByDomain = async (domainOrSubdomain: string) => {
  try {
    const exams = await Exam.find({
      $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return exams;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch exams by domain');
  }
};

const getSingleExam = async (id: string) => {
  const result = await Exam.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  return result;
};

const updateExam = async (
  id: string,
  user: JwtPayload,
  data: Partial<IExam>,
) => {
  const { organization } = user;
  
  // Check if exam with same name already exists (excluding current exam and deleted exams)
  if (data.examName) {
    const existingExam = await Exam.findOne({
      examName: data.examName,
      organization,
      isDeleted: false,
      _id: { $ne: id },
    });
    
    if (existingExam) {
      throw new AppError(httpStatus.CONFLICT, 'Exam with this name already exists in your organization');
    }
  }

  const updatedExam = await Exam.findOneAndUpdate(
    { _id: id, organization, isDeleted: false },
    data,
    { new: true },
  );

  if (!updatedExam) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  return updatedExam;
};

const deleteExamById = async (id: string) => {
  const result = await Exam.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  return result;
};

const restoreExamById = async (id: string) => {
  const result = await Exam.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exam not found');
  }
  return result;
};

export const ExamServices = {
  createExam,
  getAllExams,
  getExamsByDomain,
  getSingleExam,
  updateExam,
  deleteExamById,
  restoreExamById,
};
