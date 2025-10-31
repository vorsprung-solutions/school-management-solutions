import mongoose from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { TImageFile } from '../../../../interface/image.interface';
import { User } from '../../../global/user/repository/schema/user.schema';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import { IStaff } from '../interface/staff.interface';
import { Staff } from '../repository/schema/staff.schema';

const getSingleStaff = async (id: string) => {
  const staff = await Staff.findById(id);
  if (!staff) throw new Error('Staff not found');
  return staff;
};

const getAllStaffs = async (domainOrSubdomain?: string) => {
  if (!domainOrSubdomain) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Domain or subdomain is required');
  }

  const cleanedDomain = domainOrSubdomain.trim().toLowerCase();

  const organization = await Organization.findOne({
    $or: [
      { subdomain: { $regex: `^${cleanedDomain}$`, $options: 'i' } },
      { customdomain: { $regex: `^${cleanedDomain}$`, $options: 'i' } },
    ],
  });

  if (!organization) throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');

  const staffs = await Staff.find({ organization: organization._id })
    .populate('organization', 'name subdomain customdomain logo')
    .populate('user', 'role email is_deleted is_blocked _id')
    .sort({ createdAt: -1 });

  return staffs;
};

const getAllStaffsByOrganization = async (organizationId: string) => {
  return Staff.find({ organization: organizationId }).sort({ createdAt: -1 });
};

export const updateStaff = async (
  user: JwtPayload,
  data: Partial<IStaff>,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedStaff = await Staff.findByIdAndUpdate(user.id, data, {
      new: true,
      session,
    });

    if (!updatedStaff) throw new Error('Staff not found');

    const userUpdateData: Partial<{ name: string; email: string; profilePicture?: string }> = {};
    if (data.name) userUpdateData.name = data.name;
    if (data.email) userUpdateData.email = data.email;
    if (file?.path) userUpdateData.profilePicture = file.path;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(user.id, userUpdateData, { new: true, session });
    }

    await session.commitTransaction();
    session.endSession();

    return updatedStaff;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updateStaffByAdmin = async (
  user: JwtPayload,
  data: Partial<IStaff>,
  staffId: string,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const currentStaff = await Staff.findById(staffId).session(session);
    if (!currentStaff) throw new Error('Staff not found');

    const updatedStaffData: Partial<IStaff> = { ...data };
    if (file?.path) updatedStaffData.profilePicture = file.path;

    const updatedStaff = await Staff.findByIdAndUpdate(staffId, updatedStaffData, {
      new: true,
      session,
    });

    const userUpdateData: Partial<{ name: string; email: string; profilePicture?: string }> = {};
    if (data.name && data.name !== currentStaff.name) userUpdateData.name = data.name;
    if (data.email && data.email !== currentStaff.email) {
      const existingUser = await User.findOne({ email: data.email }).session(session);
      if (existingUser) throw new Error('Email already exists. Please use a different email.');
      userUpdateData.email = data.email;
    }
    if (file?.path) userUpdateData.profilePicture = file.path;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(user.id, userUpdateData, { new: true, session });
    }

    await session.commitTransaction();
    session.endSession();

    return updatedStaff;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteStaffByUserId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.is_deleted = !user.is_deleted;
  await user.save();
  return user;
};

const blockStaffByUserId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.is_blocked = !user.is_blocked;
  await user.save();
  return user;
};

export const StaffServices = {
  getSingleStaff,
  getAllStaffs,
  getAllStaffsByOrganization,
  updateStaff,
  updateStaffByAdmin,
  deleteStaffByUserId,
  blockStaffByUserId,
};
