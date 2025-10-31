import express from 'express';
import { TeacherControllers } from '../controller/teacher.controller';
import { multerUpload } from '../../../../../config/multer.config';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { TeacherValidations } from '../validations';
import { parseBody } from '../../../../middleware/bodyParser';

const router = express.Router();

// Get current logged-in teacher
router.get('/current', auth(USER_ROLE.teacher), TeacherControllers.getCurrentTeacher);

router.get('/single/:id', TeacherControllers.getSingleTeacher);

router.get('/:domain', TeacherControllers.getAllTeachers);

router.get('/organization/:id', TeacherControllers.getAllTeacherByOrganization);

router.put(
  '/',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.teacher),
  validateRequest(TeacherValidations.update),
  TeacherControllers.updateTeacher,
);

router.put(
  '/:id',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  validateRequest(TeacherValidations.update),
  TeacherControllers.updateTeacherByAdmin,
);

router.delete('/delete/:id', TeacherControllers.deleteTeacherByUserId);
router.delete('/block/:id', TeacherControllers.blockTeacherByUserId);

export const TeacherRoutes = router;
