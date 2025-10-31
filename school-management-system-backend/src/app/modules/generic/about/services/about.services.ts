import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../../../interface/image.interface';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import { IAbout } from '../interface/about.interface';
import { About } from '../repository/schema/about.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createAboutIntoDb = async (
  file: TImageFile,
  user: JwtPayload,
  payload: IAbout,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const organization = user?.organization;
    const getOrg = await Organization.findById(organization).session(session);
    if (!getOrg) {
      throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
    }

    // Check if about already exists for this organization
    const existingAbout = await About.findOne({ organization }).session(session);
    if (existingAbout) {
      throw new AppError(httpStatus.CONFLICT, 'About information already exists for this organization');
    }

    const aboutData = {
      ...payload,
      image: file?.path,
      domain: getOrg?.subdomain,
      subdomain: getOrg?.subdomain,
      organization: organization,
    };

    const result = await About.create([aboutData], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAbout = async (domainOrSubdomain: string) => {
  const result = await About.findOne({
    $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }],
  }).populate('organization', 'name subdomain customdomain logo');
  return result;
};

const getAboutByOrganization = async (organizationId: string) => {
  const result = await About.findOne({ organization: organizationId })
    .populate('organization', 'name subdomain customdomain logo');
  return result;
};

const updateAbout = async (
  user: JwtPayload,
  payload: Partial<IAbout>,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const organization = user?.organization;
    const about = await About.findOne({ organization }).session(session);
    
    if (!about) {
      throw new AppError(httpStatus.NOT_FOUND, 'About information not found');
    }

    const updateData = { ...payload };
    if (file?.path) {
      updateData.image = file.path;
    }

    const result = await About.findByIdAndUpdate(
      about._id,
      updateData,
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteAbout = async (id: string) => {
  const result = await About.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'About information not found');
  }
  return result;
};

export const AboutServices = {
  createAboutIntoDb,
  getAbout,
  getAboutByOrganization,
  updateAbout,
  deleteAbout,
};
