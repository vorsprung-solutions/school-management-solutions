import expres from 'express';
import { multerUpload } from '../../../../../config/multer.config';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../user.constance';
import { UserController } from '../controller/user.controller';
import validateRequest from '../../../../middleware/validateRequest';
import { StudentValidations } from '../../../generic/student/validations';
import { TeacherValidations } from '../../../generic/teacher/validations';
import { parseBody } from '../../../../middleware/bodyParser';
import { StaffValidations } from '../../../generic/staff/validatons';

const router = expres.Router();

router.post(
  '/create-student',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.teacher, USER_ROLE.admin),
  validateRequest(StudentValidations.create),
  UserController.createStudent,
);

router.post(
  '/create-teacher',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.teacher, USER_ROLE.admin),
  validateRequest(TeacherValidations.create),
  UserController.createTeacher,
);

router.post(
  '/create-staff',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.teacher, USER_ROLE.admin),
  validateRequest(StaffValidations.create),
  UserController.createStaff,
);

export const UserRoutes = router;
