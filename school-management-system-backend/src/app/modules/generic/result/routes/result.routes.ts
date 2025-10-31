import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { parseBody } from '../../../../middleware/bodyParser';
import { createResultZodSchema, updateResultZodSchema } from '../validations/result.validations';
import { ResultController } from '../controller/result.controller';

const router = express.Router();

// Create result (Admin/Teacher only)
router.post(
  '/create-result',
  validateRequest(createResultZodSchema),
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.createResult,
);

// Get all results (Admin/Teacher only)
router.get('/', auth(USER_ROLE.admin, USER_ROLE.teacher), ResultController.getAllResults);

// Get my results (Student only)
router.get('/my-results', auth(USER_ROLE.student), ResultController.getMyResults);

// Get results by domain (Public)
router.get('/:domain', ResultController.getResultsByDomain);

// Get single result (Admin/Teacher only)
router.get('/single/:id', auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.student), ResultController.getSingleResult);

// Update result (Admin/Teacher only)
router.put(
  '/:id',
  validateRequest(updateResultZodSchema),
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.updateResult,
);

// Delete result (Admin/Teacher only)
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.deleteResultById,
);

// Get results by student (Admin/Teacher only)
router.get(
  '/student/:studentId',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.getResultsByStudent,
);

// Get results by exam (Admin/Teacher only)
router.get(
  '/exam/:examId',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.getResultsByExam,
);

// Get result statistics (Admin/Teacher only)
router.get(
  '/statistics/overview',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.getResultStatistics,
);

export const ResultRoutes = router;
