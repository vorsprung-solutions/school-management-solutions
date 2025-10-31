import { JwtPayload } from 'jsonwebtoken';
import { INotice } from '../interface/notice.interface';
import { TImageFile } from '../../../../interface/image.interface';
import { Notice } from '../repository/schema/notice.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';

const createNotice = async (
  file: TImageFile,
  user: JwtPayload,
  payload: INotice,
) => {
  if (file) {
    payload.image = file?.path;
  }
  const organization = user?.organization;
  const getOrg = await Organization.findById(organization);
  if (!getOrg) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
  } 
  payload.domain = getOrg?.customdomain;
  payload.subdomain = getOrg?.subdomain;
  payload.organization = organization;
 
  const result = await Notice.create(payload);
  return result;
};

const getSingleNotice = async (id: string) => {
  const result = await Notice.findById(id).populate('organization');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  return result;
};

const getAllNotice = async (domainOrSubdomain: string) => {
  const result = await Notice.find({
    $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }],
  }).sort({ createdAt: -1 }); // Sort by newest first (-1 for descending order)
  return result;
};

const updateNotice = async (
  user: JwtPayload,
  id: string,
  payload: INotice,
  file: TImageFile,
) => {
  const { organization } = user;
  let updatedPayload = payload;

  if (file?.path) {
    updatedPayload = {
      ...payload,
      image: file.path,
    };
  }

  const update = await Notice.findOneAndUpdate(
    { _id: id, organization },
    updatedPayload,
    { new: true },
  );

  if (!update) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notice not found');
  }

  return update;
};

const deleteNotice = async (id: string) => {
  const result = await Notice.findByIdAndDelete(id);
  return result;
};

export const NoticeServices = {
  createNotice,
  getSingleNotice,
  getAllNotice,
  updateNotice,
  deleteNotice,
};
