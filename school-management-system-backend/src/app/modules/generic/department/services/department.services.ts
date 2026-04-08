import { JwtPayload } from 'jsonwebtoken';
import { IDepartment } from '../interface/department.interface';
import { Department } from '../repository/schema/department.schema';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';

const createDepartment = async (user: JwtPayload, department: IDepartment) => {
  const { name } = department;
  const { organization } = user;
  const existingDepartment = await Organization.findById(organization);
  if (!existingDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organizaton not found');
  }

  const payload = {
    name: name,
    domain: existingDepartment?.customdomain,
    subdomain: existingDepartment?.subdomain,
    organization: organization,
  };

  const isDepartmentExists = await Department.findOne({
    name,
    organization,
  });

  if (isDepartmentExists) {
    throw new Error('Department already exists');
  }

  const newDepartment = await Department.create(payload);

  return newDepartment;
};

const getAllDepartmentByOrgnazationId = async (id: string) => {
  const result = await Department.find({ organization: id }).sort({
    createdAt: -1,
  }); // Sort by newest first
  return result;
};

const getAllDepartment = async (domainOrSubdomain: string) => {
  const result = await Department.find({
    $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }],
  }).sort({ createdAt: -1 }); // Sort by newest first (-1 for descending order)
  return result;
};

const getSingleDepartment = async (id: string) => {
  const result = await Department.findById(id);
  if (!result) {
    throw new Error('Department not found');
  }
  return result;
};

const updateDepartment = async (
  id: string,
  user: JwtPayload,
  data: Partial<IDepartment>,
) => {
  const { organization } = user;
  const updatedDepartment = await Department.findOneAndUpdate(
    { _id: id, organization },
    data,
    { new: true },
  );

  if (!updatedDepartment) {
    throw new Error('Department not found');
  }
  return updatedDepartment;
};

const deleteDepartmentyId = async (id: string) => {
  const result = await Department.findByIdAndDelete(id);
  return result;
};

export const DepartmentServices = {
  createDepartment,
  getAllDepartmentByOrgnazationId,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartmentyId,
};
