import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { parseBody } from '../../../../middleware/bodyParser';
import { ExamValidations } from '../validations';
import { ExamController } from '../controller/exam.controller';

const router = express.Router();

router.post(
  '/create-exam',
  validateRequest(ExamValidations.create),
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ExamController.createExam,
);

router.get('/', auth(USER_ROLE.admin, USER_ROLE.teacher), ExamController.getAllExams);

// Public route for getting exams by domain (like department)
router.get('/:domain', ExamController.getExamsByDomain);

router.get('/single/:id', ExamController.getSingleExam);

router.put(
  '/:id',
  validateRequest(ExamValidations.update),
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ExamController.updateExam,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ExamController.deleteExamById,
);

router.patch(
  '/:id/restore',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ExamController.restoreExamById,
);

export const ExamRoutes = router;
