import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../../../interface/image.interface';
import { IBanner } from '../interface/banner.interface';
import { Banner } from '../repository/schema/banner.schema';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';

const createBannerIntoDb = async (
  file: TImageFile,
  user: JwtPayload,
  payload: IBanner,
) => {
  if (file) {
    payload.image = file?.path;
  }
  const organization = user?.organization;
  const getOrg = await Organization.findById(organization);
  if (getOrg) {
    payload.domain = getOrg?.customdomain;
    payload.subdomain = getOrg?.subdomain;
  }
  const result = await Banner.create(payload);
  return result;
};

const getAllBanner = async (domainOrSubdomain: string) => {
  const result = await Banner.find({
    $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }],
  }).sort({ createdAt: -1 }); // Sort by newest first (-1 for descending order)
  return result;
};

const getBannerById = async (id: string) => {
  const result = await Banner.findById(id);
  return result;
};

const updateBanner = async (
  file: TImageFile,
  user: JwtPayload,
  payload: IBanner,
  id: string,
) => {
  if (file) {
    payload.image = file?.path;
  }
  const existingBanner = await Banner.findById(id);
  if (!existingBanner) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not authorized');
  }
  const result = await Banner.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteBanner = async (id: string) => {
  const result = await Banner.findByIdAndDelete(id);
  return result;
};

export const BannerServices = {
  createBannerIntoDb,
  getAllBanner,
  deleteBanner,
  updateBanner,
  getBannerById,
};
