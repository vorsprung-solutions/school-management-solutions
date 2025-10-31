import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../../../errors/AppError';
import { TImageFile } from '../../../../interface/image.interface';
import { Student } from '../repository/schema/student.schema';
import { IStudent } from '../../student/interface/student.interface';
import { User } from '../../../global/user/repository/schema/user.schema';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import { Teacher } from '../../teacher/repository/schema/teacher.schema';
import { Staff } from '../../staff/repository/schema/staff.schema';
import { Department } from '../../department/repository/schema/department.schema';
import { Exam } from '../../exam/repository/schema/exam.schema';
import { Result } from '../../result/repository/schema/result.schema';
import { Notice } from '../../notice/repository/schema/notice.schema';
import { Attendance } from '../../attendance/repository/schema/attendance.schema';

const getSingleStudent = async (id: string) => {
  const result = await Student.findById(id);
  if (!result) {
    throw new Error('Student not found');
  }
  return result;
};

const getCurrentStudent = async (user: JwtPayload) => {
  try {
    // Find the student by user ID
    const student = await Student.findOne({ user: user.id })
      .populate('organization', 'name subdomain customdomain logo')
      .populate('department', 'name')
      .lean();

    if (!student) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    return student;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch student data');
  }
};

const getAllStudents = async (domainOrSubdomain?: string) => {
  if (!domainOrSubdomain) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Domain or subdomain is required',
    );
  }

  const cleanedDomain = domainOrSubdomain.trim().toLowerCase();

  const organization = await Organization.findOne({
    $or: [
      { subdomain: { $regex: `^${cleanedDomain}$`, $options: 'i' } },
      { customdomain: { $regex: `^${cleanedDomain}$`, $options: 'i' } },
    ],
  });

  if (!organization) {
    throw new AppError(httpStatus.NOT_FOUND, 'Organization not found');
  }

  const students = await Student.find({ organization: organization._id })
    .populate('organization', 'name subdomain customdomain logo')
    .populate('department', 'name')
    .populate('user', 'role email is_deleted is_blocked _id')
    .sort({ createdAt: -1 });

  return students;
};

const getAllStudentsByOrganization = async (organizationId: string) => {
  const result = await Student.find({ organization: organizationId })
    .populate('user', 'role email is_deleted is_blocked _id')
    .populate('department', 'name')
    .sort({
      createdAt: -1,
    }); // newest first
  return { students: result };
};

const getPublicStudents = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    search,
    class: classFilter,
    session: sessionFilter,
    department: departmentFilter,
    gender: genderFilter,
    group: groupFilter,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  // Build match conditions
  const matchConditions: any = {};

  // Search functionality
  if (search) {
    matchConditions.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { roll: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by class
  if (classFilter && classFilter !== 'all') {
    matchConditions.class = parseInt(classFilter);
  }

  // Filter by session
  if (sessionFilter && sessionFilter !== 'all') {
    matchConditions.session = parseInt(sessionFilter);
  }

  // Filter by department
  if (departmentFilter && departmentFilter !== 'all') {
    matchConditions.department = new mongoose.Types.ObjectId(departmentFilter);
  }

  // Filter by gender
  if (genderFilter && genderFilter !== 'all') {
    matchConditions.gender = genderFilter;
  }

  // Filter by group
  if (groupFilter && groupFilter !== 'all') {
    matchConditions.group = groupFilter;
  }

  // Get organization from domain (you might need to adjust this based on your domain logic)
  const organization = await Organization.findOne().sort({ createdAt: -1 });
  if (organization) {
    matchConditions.organization = organization._id;
  }

  // Get total count for pagination
  const total = await Student.countDocuments(matchConditions);

  // Get students with pagination and population
  const students = await Student.find(matchConditions)
    .populate('organization', 'name subdomain customdomain logo')
    .populate('department', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .select('-__v -createdAt -updatedAt');

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / Number(limit));
  const hasNextPage = Number(page) < totalPages;
  const hasPrevPage = Number(page) > 1;

  const meta = {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };

  return {
    data: students,
    meta,
  };
};

export const updateStudent = async (
  user: JwtPayload,
  data: Partial<IStudent>,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Prepare update data with proper type conversion
    const updateData: Partial<IStudent> = { ...data };

    // Convert string numbers to actual numbers
    if (data.phone && typeof data.phone === 'string') {
      updateData.phone = parseInt(data.phone);
    }
    if (data.ephone && typeof data.ephone === 'string') {
      updateData.ephone = parseInt(data.ephone);
    }
    if (data.roll_no && typeof data.roll_no === 'string') {
      updateData.roll_no = parseInt(data.roll_no);
    }
    if (data.reg_no && typeof data.reg_no === 'string') {
      updateData.reg_no = parseInt(data.reg_no);
    }
    if (data.class && typeof data.class === 'string') {
      updateData.class = parseInt(data.class);
    }
    if (data.session && typeof data.session === 'string') {
      updateData.session = parseInt(data.session);
    }

    // Convert date string to Date object
    if (data.dob && typeof data.dob === 'string') {
      updateData.dob = new Date(data.dob);
    }

    // Add profile picture if file is uploaded
    if (file?.path) {
      updateData.profilePicture = file.path;
    }

    // Find student by user ID (not by student ID)
    const updatedStudent = await Student.findOneAndUpdate(
      { user: user?.id },
      updateData,
      {
        new: true,
        session,
      }
    );

    if (!updatedStudent) {
      throw new Error('Student not found');
    }

    // prepare User update
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

    return updatedStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateStudentByAdmin = async (
  data: Partial<IStudent>,
  studentId: string,
  file: TImageFile,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1️⃣ get current student data
    const currentStudent = await Student.findById(studentId).session(session);
    if (!currentStudent) throw new Error('Student not found');

    // 2️⃣ prepare Student update
    const updatedStudentData: Partial<IStudent> = { ...data };
    if (file?.path) updatedStudentData.profilePicture = file.path;

    // 3️⃣ update Student
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedStudentData,
      { new: true, session },
    );

    // 4️⃣ prepare User update if necessary
    const userUpdateData: Partial<{
      name: string;
      email: string;
      profilePicture?: string;
    }> = {};

    if (data.name && data.name !== currentStudent.name) {
      userUpdateData.name = data.name;
    }

    if (data.email && data.email !== currentStudent.email) {
      // check duplicate email
      const existingUser = await User.findOne({ email: data.email }).session(
        session,
      );
      if (existingUser) {
        throw new Error('Email already exists. Please use a different email.');
      }
      userUpdateData.email = data.email;
    }

    if (file?.path) {
      userUpdateData.profilePicture = file.path;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(currentStudent?.user, userUpdateData, {
        new: true,
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return updatedStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteStudentByUserId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.is_deleted = !user.is_deleted; // toggle
  await user.save();

  return user;
};

const blockStudentByUserId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.is_blocked = !user.is_blocked; // toggle
  await user.save();

  return user;
};

// Get students by class, session, and group filters
const getStudentsByFilters = async (organization: string, filters: { class?: number; session?: number; group?: string }) => {
  try {
    const query: any = { organization };
    
    // Only add filters if they have valid values
    if (filters.class && filters.class > 0) query.class = filters.class;
    if (filters.session && filters.session > 0) query.session = filters.session;
    if (filters.group && filters.group.trim() !== '') query.group = filters.group;

    const students = await Student.find(query)
      .select('name rollNumber class session group')
      .sort({ name: 1 })
      .lean();

    return students;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch students by filters');
  }
};

// Get dashboard statistics
const getDashboardStats = async (organizationId: string) => {
  try {
    // Get counts from different collections
    const [
      totalStudents,
      totalTeachers,
      totalStaff,
      totalDepartments,
      totalExams,
      totalResults,
      totalNotices,
      totalAttendance
    ] = await Promise.all([
      // Total students
      Student.countDocuments({ organization: organizationId }),
      
      // Total teachers - count from Teacher collection
      Teacher.countDocuments({ organization: organizationId }),
      
      // Total staff - count from Staff collection
      Staff.countDocuments({ organization: organizationId }),
      
      // Total departments
      Department.countDocuments({ organization: organizationId }),
      
      // Total exams
      Exam.countDocuments({ organization: organizationId }),
      
      // Total results
      Result.countDocuments({ organization: organizationId }),
      
      // Total notices
      Notice.countDocuments({ organization: organizationId }),
      
      // Total attendance records
      Attendance.countDocuments({ organization: organizationId })
    ]);

    // Get active students count (students whose users are not deleted)
    const activeStudentsResult = await Student.aggregate([
      {
        $match: { organization: new mongoose.Types.ObjectId(organizationId) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $match: {
          'userInfo.is_deleted': { $ne: true }
        }
      },
      {
        $count: 'activeCount'
      }
    ]);

    const activeStudents = activeStudentsResult.length > 0 ? activeStudentsResult[0].activeCount : 0;

    // Get recent activities
    const recentStudents = await Student.find({ organization: organizationId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean();

    const recentNotices = await Notice
      .find({ organization: organizationId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title date createdAt')
      .lean();

    return {
      counts: {
        totalStudents,
        activeStudents,
        totalTeachers,
        totalStaff,
        totalDepartments,
        totalExams,
        totalResults,
        totalNotices,
        totalAttendance
      },
      recentActivities: {
        recentStudents,
        recentNotices
      }
    };
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch dashboard statistics');
  }
};

export const StudentServices = {
  getSingleStudent,
  getCurrentStudent,
  getAllStudents,
  getAllStudentsByOrganization,
  updateStudent,
  updateStudentByAdmin,
  deleteStudentByUserId,
  blockStudentByUserId,
  getPublicStudents,
  getStudentsByFilters,
  getDashboardStats,
};
