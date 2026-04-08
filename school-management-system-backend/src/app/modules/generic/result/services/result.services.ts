import { JwtPayload } from 'jsonwebtoken';
import { IResult } from '../interface/result.interface';
import { Result, GradeEnum } from '../repository/schema/result.schema';
import { Exam } from '../../exam/repository/schema/exam.schema';
import { Student } from '../../student/repository/schema/student.schema';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import AppError from '../../../../errors/AppError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

const createResult = async (user: JwtPayload, resultData: IResult) => {
  const { organization } = user;
  const { exam: examId, student: studentId, year, class: className, session } = resultData;

  // Validate exam exists and is not deleted
  const exam = await Exam.findOne({ _id: examId, organization, isDeleted: false });
  if (!exam) {
    throw new AppError(httpStatus.NOT_FOUND, 'Exam not found or has been deleted');
  }

  // Validate student exists
  const student = await Student.findOne({ _id: studentId, organization });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  // Check if result already exists for this student, exam, year, class, and session
  const existingResult = await Result.findOne({
    student: studentId,
    exam: examId,
    year,
    class: className,
    session,
    organization,
  });

  if (existingResult) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Result already exists for this student, exam, year, class, and session'
    );
  }

  // Calculate overall GPA as average of subject GPAs
  const subjectGPAs = resultData.results.map(subject => subject.gpa);
  const calculatedGPA = subjectGPAs.reduce((sum, gpa) => sum + gpa, 0) / subjectGPAs.length;
  
  // Calculate total marks
  const totalMarks = resultData.results.reduce((sum, subject) => sum + subject.marks, 0);

  // Determine if passed (you can customize this logic)
  const isPassed = calculatedGPA >= 2.0; // Minimum GPA of 2.0 to pass

  // Determine overall grade based on GPA
  let overallGrade = 'F';
  if (calculatedGPA >= 4.7) overallGrade = 'A+';
  else if (calculatedGPA >= 4.0) overallGrade = 'A';
  else if (calculatedGPA >= 3.7) overallGrade = 'A-';
  else if (calculatedGPA >= 3.3) overallGrade = 'B+';
  else if (calculatedGPA >= 3.0) overallGrade = 'B';
  else if (calculatedGPA >= 2.7) overallGrade = 'B-';
  else if (calculatedGPA >= 2.3) overallGrade = 'C+';
  else if (calculatedGPA >= 2.0) overallGrade = 'C';
  else if (calculatedGPA >= 1.7) overallGrade = 'C-';
  else if (calculatedGPA >= 1.3) overallGrade = 'D+';
  else if (calculatedGPA >= 1.0) overallGrade = 'D';

  const newResult = await Result.create({
    ...resultData,
    gpa: Number(calculatedGPA.toFixed(2)), // Use calculated GPA
    total_marks: totalMarks, // Use calculated total marks
    grade: overallGrade as GradeEnum, // Use calculated grade
    is_passed: isPassed, // Use calculated pass status
    organization,
  });

  // Populate exam and student details
  const populatedResult = await Result.findById(newResult._id)
    .populate('exam', 'examName')
    .populate('student', 'name roll_no reg_no department')
    .lean();

  return populatedResult;
};

const getAllResults = async (organization?: string, filters?: any) => {
  try {
    const matchQuery: any = {};

    if (organization) {
      matchQuery.organization = organization;
    }

    // Apply filters
    if (filters) {
      if (filters.exam) matchQuery.exam = filters.exam;
      if (filters.student) matchQuery.student = filters.student;
      if (filters.year) matchQuery.year = filters.year;
      if (filters.class) matchQuery.class = filters.class;
      if (filters.session) matchQuery.session = filters.session;
      if (filters.group) matchQuery.group = filters.group;
    }

    // Pagination
    const page = parseInt(filters?.page) || 1;
    const limit = parseInt(filters?.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await Result.countDocuments(matchQuery);

    // Get paginated results
    const results = await Result.find(matchQuery)
      .populate('exam', 'examName')
      .populate('student', 'name roll_no reg_no department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { 
      results, 
      count: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch results');
  }
};

const getResultsByDomain = async (domainOrSubdomain: string, filters?: any) => {
  try {
    const matchQuery: any = {};

    // Apply basic filters (non-populated fields)
    if (filters) {
      if (filters.exam) matchQuery.exam = filters.exam;
      if (filters.student) matchQuery.student = filters.student;
      if (filters.year) matchQuery.year = parseInt(filters.year);
      if (filters.class) matchQuery.class = parseInt(filters.class);
      if (filters.session) matchQuery.session = parseInt(filters.session);
      if (filters.group) matchQuery.group = filters.group;
    }

    // First, get the organization for this domain
    const allOrganizations = await Organization.find({}).select('domain subdomain name');
    
    let organization = await Organization.findOne({
      $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }]
    });

    // For development, if no organization found with the domain, use the first available organization
    if (!organization && allOrganizations.length > 0) {
      organization = allOrganizations[0];
    }

    if (!organization) {
      throw new AppError(httpStatus.NOT_FOUND, 'Organization not found for this domain');
    }

    // Add organization filter
    matchQuery.organization = organization._id;

    // If roll number is provided, we need to find the specific student first
    let studentFilter = null;
    if (filters && filters.rollNumber) {
      // Find the student by roll number
      const student = await Student.findOne({
        organization: organization._id,
        $or: [
          { roll_no: filters.rollNumber },
          { rollNumber: filters.rollNumber },
          { roll: filters.rollNumber },
          { roll_number: filters.rollNumber }
        ]
      });

      if (!student) {
        // If no student found with this roll number, return empty results
        return [];
      }

      // Add student filter to match query
      matchQuery.student = student._id;
    }

    const results = await Result.find(matchQuery)
      .populate({
        path: 'exam',
        match: {
          $or: [{ domain: domainOrSubdomain }, { subdomain: domainOrSubdomain }],
          isDeleted: false,
        },
        select: 'examName',
      })
      .populate('student', 'name roll_no reg_no department')
      .sort({ createdAt: -1 })
      .lean();

    // Filter out results where exam is null (exam was deleted or doesn't match domain)
    let validResults = results.filter(result => result.exam);

    // Apply additional text-based filters after population (for non-roll number filters)
    if (filters && !filters.rollNumber) {
      if (filters.rollNumber) {
        const rollNumberRegex = new RegExp(filters.rollNumber, 'i');
        validResults = validResults.filter(result => {
          if (!result.student || typeof result.student === 'string') {
            return false;
          }
          const student = result.student as any;
          
          // Check for rollNumber in different possible field names
          const rollNumber = student.roll_no || student.rollNumber || student.roll || student.roll_number;
          const hasRollNumber = rollNumber && rollNumberRegex.test(rollNumber.toString());
          return hasRollNumber;
        });
      }
    }

    return validResults;
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch results by domain');
  }
};

const getSingleResult = async (id: string) => {
  const result = await Result.findById(id)
    .populate('exam', 'examName')
    .populate('student', 'name roll_no reg_no department')
    .lean();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
  }

  return result;
};

const updateResult = async (
  id: string,
  user: JwtPayload,
  data: Partial<IResult>
) => {
  const { organization } = user;
  const { exam: examId } = data;

  // If exam is being updated, validate it exists and is not deleted
  if (examId) {
    const exam = await Exam.findOne({ _id: examId, organization, isDeleted: false });
    if (!exam) {
      throw new AppError(httpStatus.NOT_FOUND, 'Exam not found or has been deleted');
    }
  }

  // If student is being updated, validate it exists
  if (data.student) {
    const student = await Student.findOne({ _id: data.student, organization });
    if (!student) {
      throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }
  }

  // Check for duplicate results if key fields are being updated
  if (data.student || data.exam || data.year || data.class || data.session) {
    const existingResult = await Result.findOne({
      _id: { $ne: id },
      student: data.student,
      exam: data.exam,
      year: data.year,
      class: data.class,
      session: data.session,
      organization,
    });

    if (existingResult) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Result already exists for this student, exam, year, class, and session'
      );
    }
  }

  // If results are being updated, recalculate GPA, total marks, grade, and pass status
  if (data.results && data.results.length > 0) {
    // Calculate overall GPA as average of subject GPAs
    const subjectGPAs = data.results.map(subject => subject.gpa);
    const calculatedGPA = subjectGPAs.reduce((sum, gpa) => sum + gpa, 0) / subjectGPAs.length;
    
    // Calculate total marks
    const totalMarks = data.results.reduce((sum, subject) => sum + subject.marks, 0);

    // Determine if passed (you can customize this logic)
    const isPassed = calculatedGPA >= 2.0; // Minimum GPA of 2.0 to pass

    // Determine overall grade based on GPA
    let overallGrade = 'F';
    if (calculatedGPA >= 4.7) overallGrade = 'A+';
    else if (calculatedGPA >= 4.0) overallGrade = 'A';
    else if (calculatedGPA >= 3.7) overallGrade = 'A-';
    else if (calculatedGPA >= 3.3) overallGrade = 'B+';
    else if (calculatedGPA >= 3.0) overallGrade = 'B';
    else if (calculatedGPA >= 2.7) overallGrade = 'B-';
    else if (calculatedGPA >= 2.3) overallGrade = 'C+';
    else if (calculatedGPA >= 2.0) overallGrade = 'C';
    else if (calculatedGPA >= 1.7) overallGrade = 'C-';
    else if (calculatedGPA >= 1.3) overallGrade = 'D+';
    else if (calculatedGPA >= 1.0) overallGrade = 'D';

    // Update the data with calculated values
    data.gpa = Number(calculatedGPA.toFixed(2));
    data.total_marks = totalMarks;
    data.grade = overallGrade as GradeEnum;
    data.is_passed = isPassed;
  }

  const updatedResult = await Result.findOneAndUpdate(
    { _id: id, organization },
    data,
    { new: true }
  )
    .populate('exam', 'examName')
    .populate('student', 'name roll_no reg_no department')
    .lean();

  if (!updatedResult) {
    throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
  }

  return updatedResult;
};

const deleteResultById = async (id: string) => {
  const result = await Result.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Result not found');
  }
  return result;
};

// Get results by student
const getResultsByStudent = async (studentId: string, organization?: string) => {
  const query: any = { student: studentId };
  if (organization) {
    query.organization = organization;
  }

  const result = await Result.find(query)
    .populate('exam', 'examName')
    .populate('student', 'name roll_no reg_no department')
    .sort({ createdAt: -1 })
    .lean();

  return result;
};

// Get results for current logged-in student
const getMyResults = async (userId: string) => {
  // Find student by user ID
  const student = await Student.findOne({ user: userId }).lean();
  
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student profile not found');
  }

  // Get results for the student
  const results = await Result.find({ student: student._id })
    .populate('exam', 'examName')
    .populate('student', 'name roll_no reg_no department')
    .sort({ createdAt: -1 })
    .lean();

  return results;
};

// Get results by exam
const getResultsByExam = async (examId: string, organization?: string) => {
  const query: any = { exam: examId };
  if (organization) {
    query.organization = organization;
  }

  const result = await Result.find(query)
    .populate('exam', 'examName')
    .populate('student', 'name roll_no reg_no department')
    .sort({ createdAt: -1 })
    .lean();

  return result;
};

// Get result statistics
const getResultStatistics = async (organization?: string) => {
  const query: any = {};
  if (organization) {
    query.organization = organization;
  }

  const results = await Result.find(query).lean();

  const totalResults = results.length;
  const averageGPA = results.length > 0 
    ? results.reduce((sum, result) => sum + result.gpa, 0) / results.length 
    : 0;
  const passedCount = results.filter(result => result.is_passed).length;
  const failedCount = totalResults - passedCount;

  return {
    totalResults,
    averageGPA: Number(averageGPA.toFixed(2)),
    passedCount,
    failedCount,
  };
};

export const ResultServices = {
  createResult,
  getAllResults,
  getResultsByDomain,
  getSingleResult,
  updateResult,
  deleteResultById,
  getResultsByStudent,
  getMyResults,
  getResultsByExam,
  getResultStatistics,
};
