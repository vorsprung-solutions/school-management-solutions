import express from 'express';
import { DepartmentController } from '../controller/department.controller';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { DepartmentValidations } from '../validations';
import { parseBody } from '../../../../middleware/bodyParser';

const router = express.Router();

router.post(
  '/create-department',
  validateRequest(DepartmentValidations.create),
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  DepartmentController.createDepartment,
);

router.get(
  'all-department/:id',
  DepartmentController.getAllDepartmentByOrganizationId,
);

router.get('/:domain', DepartmentController.getAllDepartment);

router.get('/single/:id', DepartmentController.getSingleDepartment);

router.put(
  '/:id',
  validateRequest(DepartmentValidations.update),
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  DepartmentController.updateDepartment,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  DepartmentController.deleteDepartmentyId,
);

export const DepartmentRoutes = router;
