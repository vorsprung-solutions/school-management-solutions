import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { AttendanceValidations } from '../validations';
import { AttendanceControllers } from '../controller/attendance.controller';
import { parseBody } from '../../../../middleware/bodyParser';

const router = express.Router();

// Create attendance (Admin, Teacher, Staff)
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  parseBody,
  validateRequest(AttendanceValidations.create),
  AttendanceControllers.createAttendance,
);

// Get all attendance with pagination and filtering (Admin, Teacher, Staff)
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  validateRequest(AttendanceValidations.getAttendanceQuery),
  AttendanceControllers.getAllAttendance,
);

// Get attendance statistics (Admin, Teacher, Staff)
router.get(
  '/stats',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  validateRequest(AttendanceValidations.getAttendanceQuery),
  AttendanceControllers.getAttendanceStats,
);

// Get students for attendance creation (Admin, Teacher, Staff)
router.get(
  '/students',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  AttendanceControllers.getStudentsForAttendance,
);

// Get student attendance with pagination and filtering (Student can view their own)
router.get(
  '/student/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff, USER_ROLE.student),
  validateRequest(AttendanceValidations.getAttendanceQuery),
  AttendanceControllers.getAttendanceByStudent,
);

// Get current student's attendance (Student can view their own)
router.get(
  '/my-attendance',
  auth(USER_ROLE.student),
  validateRequest(AttendanceValidations.getAttendanceQuery),
  AttendanceControllers.getMyAttendance,
);

// Get organization attendance (Admin only)
router.get(
  '/organization/:id',
  auth(USER_ROLE.admin),
  AttendanceControllers.getAttendanceByOrganization,
);

// Get attendance by ID (Admin, Teacher, Staff)
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  AttendanceControllers.getAttendanceById,
);

// Update attendance (Admin, Teacher, Staff)
router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  parseBody,
  validateRequest(AttendanceValidations.update),
  AttendanceControllers.updateAttendance,
);

// Delete attendance (Admin only)
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  AttendanceControllers.deleteAttendance,
);
  
export const AttendanceRoutes = router;
