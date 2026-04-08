import express from 'express';
import { AuthController } from '../controller/auth.controller';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { organizationValidations } from '../../../global/organization/validations';
import { multerUpload } from '../../../../../config/multer.config';

const router = express.Router();

router.post(
  '/create-organization',
  multerUpload.single('file'),
  auth(USER_ROLE.super_admin),
  validateRequest(organizationValidations.create),
  AuthController.createOrganization,
);

router.post('/login', AuthController.loginUser);

router.post(
  '/change-password',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.staff,
    USER_ROLE.student,
    USER_ROLE.teacher,
  ),
  AuthController.changePassword,
);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/forget-password', AuthController.forgetPassword);

router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;
