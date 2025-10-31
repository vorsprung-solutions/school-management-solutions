import express from 'express';
import { StudentControllers } from '../controller/student.controller';
import { multerUpload } from '../../../../../config/multer.config';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { StudentValidations } from '../validations';
import { parseBody } from '../../../../middleware/bodyParser';

const router = express.Router();

// Public API for academic section - Get students with filtering and pagination
router.get('/public/list', StudentControllers.getPublicStudents);

// Get single student
router.get('/single/:id', StudentControllers.getSingleStudent);

// Get current logged-in student
router.get('/current', auth(USER_ROLE.student), StudentControllers.getCurrentStudent);

// Get all students by current user's organization
router.get('/organization/all', auth(USER_ROLE.admin, USER_ROLE.teacher), StudentControllers.getAllStudentsByCurrentOrganization);

// Get all students by organization
router.get('/organization/:id', StudentControllers.getAllStudentsByOrganization);

// Get students by filters (class, session, group)
router.get('/filter', auth(USER_ROLE.admin, USER_ROLE.teacher), StudentControllers.getStudentsByFilters);

// Get dashboard statistics
router.get('/dashboard/stats', auth(USER_ROLE.admin), StudentControllers.getDashboardStats);

// Get all students by domain (this should be last to avoid conflicts)
router.get('/:domain', StudentControllers.getAllStudents);

// Update student (self update, role = student)
router.put(
  '/',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.student),
  validateRequest(StudentValidations.update),
  StudentControllers.updateStudent,
);

// Update student (by admin)
router.put(
  '/:id',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  validateRequest(StudentValidations.update),
  StudentControllers.updateStudentByAdmin,
);

// Delete student (soft delete / toggle is_deleted)
router.delete('/delete/:id', StudentControllers.deleteStudentByUserId);

// Block student
router.delete('/block/:id', StudentControllers.blockStudentByUserId);

export const StudentRoutes = router;
