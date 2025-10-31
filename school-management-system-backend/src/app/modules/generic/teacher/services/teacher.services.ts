import { JwtPayload } from 'jsonwebtoken';
import { Teacher } from '../repository/schema/teacher.schema';
import { ITeacher } from '../inteface/tacher.interface';
import { TImageFile } from '../../../../interface/image.interface';
import mongoose from 'mongoose';
import { User } from '../../../global/user/repository/schema/user.schema';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';

const getSingleTeacher = async (id: string) => {
  const result = await Teacher.findById(id);
  if (!result) {
    throw new Error('Teacher not found');
  }
  return result;
};

const getCurrentTeacher = async (user: JwtPayload) => {
  try {
    // Find the teacher by user ID
    const teacher = await Teacher.findOne({ user: user.id })
      .populate('organization', 'name subdomain customdomain logo')
      .populate('department', 'name')
      .lean();

    if (!teacher) {
      throw new AppError(httpStatus.NOT_FOUND, 'Teacher not found');
    }

    return teacher;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch teacher data');
  }
};

const getAllTeachers = async (domainOrSubdomain?: string) => {
  if (!domainOrSubdomain) {
    throw new AppError(httpStatus.BAD_REQUEST, "Domain or subdomain is required");
  }

  const cleanedDomain = domainOrSubdomain.trim().toLowerCase();

  const organization = await Organization.findOne({
    $or: [
      { subdomain: { $regex: `^${cleanedDomain}$`, $options: "i" } },
      { customdomain: { $regex: `^${cleanedDomain}$`, $options: "i" } },
    ],
  });

  if (!organization) {
    throw new AppError(httpStatus.NOT_FOUND, "Organization not found");
  }

  const teachers = await Teacher.find({ organization: organization._id })
    .populate("organization", "name subdomain customdomain logo")
    .populate("department", "name")
    .populate("user", "role email is_deleted is_blocked _id")
    .sort({ createdAt: -1 });

  return teachers;
};

const getAllTeachersByOrganization = async (organizationId: string) => {
  const result = await Teacher.find({ organization: organizationId }).sort({
    createdAt: -1,
  }); // Sort by newest first
  return result;
};

export const updateTeacher = async (
  user: JwtPayload,
  data: Partial<ITeacher>,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Prepare update data with proper type conversion
    const updateData: Partial<ITeacher> = { ...data };

    // Convert string numbers to actual numbers
    if (data.phone && typeof data.phone === 'string') {
      updateData.phone = parseInt(data.phone);
    }
    if (data.ephone && typeof data.ephone === 'string') {
      updateData.ephone = parseInt(data.ephone);
    }

    // Convert date string to Date object
    if (data.join_date && typeof data.join_date === 'string') {
      updateData.join_date = new Date(data.join_date);
    }

    // Add profile picture if file is uploaded
    if (file?.path) {
      updateData.profilePicture = file.path;
    }

    // Find teacher by user ID (not by teacher ID)
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { user: user?.id },
      updateData,
      {
        new: true,
        session,
      }
    );

    if (!updatedTeacher) {
      throw new Error('Teacher not found');
    }

    // Prepare user update object only with relevant fields
    const userUpdateData: Partial<{
      name: string;
      email: string;
      profilePicture?: string;
    }> = {};

    if (data.name) userUpdateData.name = data.name;
    if (data.email) userUpdateData.email = data.email;
    if (file?.path) userUpdateData.profilePicture = file?.path;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(user?.id, userUpdateData, {
        new: true,
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return updatedTeacher;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateTeacherByAdmin = async (
   
  data: Partial<ITeacher>,
  teacherId: string,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1️⃣ Get current teacher data
    const currentTeacher = await Teacher.findById(teacherId).session(session);
    if (!currentTeacher) throw new Error("Teacher not found");

    // 2️⃣ Prepare Teacher update
    const updatedTeacherData: Partial<ITeacher> = { ...data };

    // Include profile picture if new file provided
    if (file?.path) updatedTeacherData.profilePicture = file.path;

    // 3️⃣ Update Teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      updatedTeacherData,
      { new: true, session }
    );

    // 4️⃣ Prepare User update only if teacher’s name/email actually changed
    const userUpdateData: Partial<{ name: string; email: string; profilePicture?: string }> = {};

    if (data.name && data.name !== currentTeacher.name) {
      userUpdateData.name = data.name;
    }

    if (data.email && data.email !== currentTeacher.email) {
      // Check for duplicate email
      const existingUser = await User.findOne({ email: data.email }).session(session);
      if (existingUser) {
        throw new Error("Email already exists. Please use a different email.");
      }
      userUpdateData.email = data.email;
    }

    if (file?.path) {
      userUpdateData.profilePicture = file.path;
    }

    // 5️⃣ Update User if needed
    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(currentTeacher?.user, userUpdateData, {
        new: true,
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return updatedTeacher;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};




const deleteTeacherByUserId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.is_deleted = !user.is_deleted; // toggle true/false
  await user.save();

  return user;
};

const blockTeacherByUserId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.is_blocked = !user.is_blocked; // toggle true/false
  await user.save();

  return user;
};

export const TeacherServices = {
  getSingleTeacher,
  getCurrentTeacher,
  getAllTeachers,
  getAllTeachersByOrganization,
  updateTeacher,
  updateTeacherByAdmin,
  deleteTeacherByUserId,
  blockTeacherByUserId,
};
