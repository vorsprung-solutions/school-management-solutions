import { JwtPayload } from 'jsonwebtoken';
import { Attendance } from '../repository/schema/attendance.schema';
import { Student } from '../../student/repository/schema/student.schema';
import { Department } from '../../department/repository/schema/department.schema';
import { IAttendance, IAttendanceQuery, IAttendanceWithDetails } from '../interface/attendance.interface';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const createAttendance = async (user: JwtPayload, payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find student and verify they belong to the user's organization
    const student = await Student.findOne({
      _id: payload.student,
      organization: user.organization,
    }).session(session);

    if (!student) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    // Get student's department
    const department = await Department.findById(student.department).session(session);
    if (!department) {
      throw new AppError(httpStatus.NOT_FOUND, 'Department not found');
    }

    const attendanceData = {
      student: payload.student,
      status: payload.status,
      date: payload?.date ? new Date(payload.date) : new Date(),
      department: student.department,
      group: student.group,
      remark: payload.remark,
    };

    const result = await Attendance.create([attendanceData], { session });
    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllAttendanceWithPagination = async (user: JwtPayload, query: IAttendanceQuery) => {
  console.log('Backend received query:', query);
  
  const {
    search = '',
    status,
    class: classFilter,
    session: sessionFilter,
    group,
    department,
    startDate,
    endDate,
    month,
    year,
    page = 1,
    limit = 10,
  } = query;

  console.log('Class filter:', classFilter, typeof classFilter);
  console.log('Session filter:', sessionFilter, typeof sessionFilter);
  
  // Convert to numbers for MongoDB comparison
  const classFilterNum = classFilter ? parseInt(classFilter.toString(), 10) : undefined;
  const sessionFilterNum = sessionFilter ? parseInt(sessionFilter.toString(), 10) : undefined;
  console.log('Class filter (number):', classFilterNum, typeof classFilterNum);
  console.log('Session filter (number):', sessionFilterNum, typeof sessionFilterNum);

  // Ensure page and limit are numbers
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  const skip = (pageNum - 1) * limitNum;

  // Build match conditions
  const matchConditions: any = {};
  console.log('Match conditions before class/session:', matchConditions);

  // Add search functionality
  if (search) {
    matchConditions.$or = [
      { 'student.name': { $regex: search, $options: 'i' } },
      { 'student.email': { $regex: search, $options: 'i' } },
      { 'student.roll': { $regex: search, $options: 'i' } },
      { 'department.name': { $regex: search, $options: 'i' } },
      { group: { $regex: search, $options: 'i' } },
    ];
  }

  // Add filters
  if (status) matchConditions.status = status;
  if (group) matchConditions.group = group;
  if (department) matchConditions['department._id'] = new mongoose.Types.ObjectId(department);

  // Date filters
  if (startDate || endDate) {
    matchConditions.date = {};
    if (startDate) matchConditions.date.$gte = new Date(startDate);
    if (endDate) matchConditions.date.$lte = new Date(endDate);
  }

  if (month || year) {
    matchConditions.date = {};
    if (year) {
      matchConditions.date.$gte = new Date(year, 0, 1);
      matchConditions.date.$lt = new Date(year + 1, 0, 1);
    }
    if (month) {
      matchConditions.date.$gte = new Date(year || new Date().getFullYear(), month - 1, 1);
      matchConditions.date.$lt = new Date(year || new Date().getFullYear(), month, 1);
    }
  }

  const pipeline = [
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student',
      },
    },
    {
      $unwind: '$student',
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: '$department',
    },
    {
      $match: {
        'student.organization': new mongoose.Types.ObjectId(user.organization),
        ...matchConditions,
      },
    },
    // Apply class and session filters after student lookup
    ...(classFilterNum ? [{ $match: { 'student.class': classFilterNum } }] : []),
    ...(sessionFilterNum ? [{ $match: { 'student.session': sessionFilterNum } }] : []),
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              _id: 1,
              status: 1,
              date: 1,
              group: 1,
              remark: 1,
              'student._id': 1,
              'student.name': 1,
              'student.email': 1,
              'student.roll': 1,
              'student.class': 1,
              'student.session': 1,
              'student.group': 1,
              'department._id': 1,
              'department.name': 1,
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ];

  console.log('Pipeline:', JSON.stringify(pipeline, null, 2));
  console.log('Class filter in pipeline:', classFilterNum);
  console.log('Session filter in pipeline:', sessionFilterNum);
  const result = await Attendance.aggregate(pipeline);
  const data = result[0]?.data || [];
  const total = result[0]?.total[0]?.count || 0;
  console.log('Result data length:', data.length);
  console.log('Total count:', total);
  if (data.length > 0) {
    console.log('Sample data:', data[0]);
  }

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getAttendanceByStudent = async (studentId: string, query: IAttendanceQuery) => {
  const {
    startDate,
    endDate,
    month,
    year,
    page = 1,
    limit = 10,
  } = query;

  // Ensure page and limit are numbers
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  const skip = (pageNum - 1) * limitNum;

  // Build date filters
  const dateFilter: any = {};
  if (startDate || endDate) {
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
  }

  if (month || year) {
    if (year) {
      dateFilter.$gte = new Date(year, 0, 1);
      dateFilter.$lt = new Date(year + 1, 0, 1);
    }
    if (month) {
      dateFilter.$gte = new Date(year || new Date().getFullYear(), month - 1, 1);
      dateFilter.$lt = new Date(year || new Date().getFullYear(), month, 1);
    }
  }

  const pipeline = [
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student',
      },
    },
    {
      $unwind: '$student',
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: '$department',
    },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              _id: 1,
              status: 1,
              date: 1,
              group: 1,
              remark: 1,
              'student._id': 1,
              'student.name': 1,
              'student.email': 1,
              'student.roll': 1,
              'student.class': 1,
              'student.session': 1,
              'student.group': 1,
              'department._id': 1,
              'department.name': 1,
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const result = await Attendance.aggregate(pipeline);
  const data = result[0]?.data || [];
  const total = result[0]?.total[0]?.count || 0;

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getMyAttendance = async (user: JwtPayload, query: IAttendanceQuery) => {
  // Find student by user ID
  const student = await Student.findOne({ user: user.id }).lean();
  
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student profile not found');
  }

  // Use the existing getAttendanceByStudent function with the found student ID
  return await getAttendanceByStudent(student._id.toString(), query);
};

const getAttendanceById = async (id: string) => {
  const result = await Attendance.findById(id)
    .populate('student', 'name email roll class session group')
    .populate('department', 'name');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Attendance not found');
  }

  return result;
};

const getAttendanceByOrganization = async (organizationId: string) => {
  const pipeline = [
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student',
      },
    },
    {
      $unwind: '$student',
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: '$department',
    },
    {
      $match: {
        'student.organization': new mongoose.Types.ObjectId(organizationId),
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        date: 1,
        group: 1,
        remark: 1,
        'student._id': 1,
        'student.name': 1,
        'student.email': 1,
        'student.roll': 1,
        'student.class': 1,
        'student.session': 1,
        'student.group': 1,
        'department._id': 1,
        'department.name': 1,
      },
    },
  ];

  return await Attendance.aggregate(pipeline);
};

const updateAttendance = async (user: JwtPayload, id: string, payload: Partial<IAttendance>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const attendance = await Attendance.findById(id).session(session);
    if (!attendance) {
      throw new AppError(httpStatus.NOT_FOUND, 'Attendance not found');
    }

    // Verify the attendance belongs to the user's organization
    const student = await Student.findById(attendance.student).session(session);
    if (!student || student.organization.toString() !== user.organization) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only update attendance from your organization');
    }

    const updateData: any = {};
    if (payload.status) updateData.status = payload.status;
    if (payload.date) updateData.date = new Date(payload.date);
    if (payload.remark !== undefined) updateData.remark = payload.remark;

    const result = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, session }
    ).populate('student', 'name email roll class session group')
     .populate('department', 'name');

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteAttendance = async (user: JwtPayload, id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const attendance = await Attendance.findById(id).session(session);
    if (!attendance) {
      throw new AppError(httpStatus.NOT_FOUND, 'Attendance not found');
    }

    // Verify the attendance belongs to the user's organization
    const student = await Student.findById(attendance.student).session(session);
    if (!student || student.organization.toString() !== user.organization) {
      throw new AppError(httpStatus.FORBIDDEN, 'You can only delete attendance from your organization');
    }

    const result = await Attendance.findByIdAndDelete(id).session(session);
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAttendanceStats = async (user: JwtPayload, query: IAttendanceQuery) => {
  const {
    class: classFilter,
    session: sessionFilter,
    group,
    department,
    startDate,
    endDate,
    month,
    year,
  } = query;

  // Convert to numbers for MongoDB comparison
  const classFilterNum = classFilter ? parseInt(classFilter.toString(), 10) : undefined;
  const sessionFilterNum = sessionFilter ? parseInt(sessionFilter.toString(), 10) : undefined;

  // Build match conditions
  const matchConditions: any = {};

  // Add filters
  if (group) matchConditions.group = group;
  if (department) matchConditions['department._id'] = new mongoose.Types.ObjectId(department);

  // Date filters
  if (startDate || endDate) {
    matchConditions.date = {};
    if (startDate) matchConditions.date.$gte = new Date(startDate);
    if (endDate) matchConditions.date.$lte = new Date(endDate);
  }

  if (month || year) {
    matchConditions.date = {};
    if (year) {
      matchConditions.date.$gte = new Date(year, 0, 1);
      matchConditions.date.$lt = new Date(year + 1, 0, 1);
    }
    if (month) {
      matchConditions.date.$gte = new Date(year || new Date().getFullYear(), month - 1, 1);
      matchConditions.date.$lt = new Date(year || new Date().getFullYear(), month, 1);
    }
  }

  const pipeline = [
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student',
      },
    },
    {
      $unwind: '$student',
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: '$department',
    },
    {
      $match: {
        'student.organization': new mongoose.Types.ObjectId(user.organization),
        ...matchConditions,
      },
    },
    // Apply class and session filters after student lookup
    ...(classFilterNum ? [{ $match: { 'student.class': classFilterNum } }] : []),
    ...(sessionFilterNum ? [{ $match: { 'student.session': sessionFilterNum } }] : []),
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
        },
        late: {
          $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
        },
        leave: {
          $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] },
        },
      },
    },
  ];

  const result = await Attendance.aggregate(pipeline);
  const stats = result[0] || { total: 0, present: 0, absent: 0, late: 0, leave: 0 };

  return {
    total: stats.total,
    present: stats.present,
    absent: stats.absent,
    late: stats.late,
    leave: stats.leave,
    presentPercentage: stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(2) : '0',
    absentPercentage: stats.total > 0 ? ((stats.absent / stats.total) * 100).toFixed(2) : '0',
    latePercentage: stats.total > 0 ? ((stats.late / stats.total) * 100).toFixed(2) : '0',
    leavePercentage: stats.total > 0 ? ((stats.leave / stats.total) * 100).toFixed(2) : '0',
  };
};

const getStudentsForAttendance = async (user: JwtPayload) => {
  const students = await Student.find({ organization: user.organization })
    .populate('department', 'name')
    .select('name email roll class session group department')
    .sort({ name: 1 });

  return students;
};

export const AttendanceServices = {
  createAttendance,
  getAllAttendanceWithPagination,
  getAttendanceByStudent,
  getMyAttendance,
  getAttendanceById,
  getAttendanceByOrganization,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
  getStudentsForAttendance,
};
