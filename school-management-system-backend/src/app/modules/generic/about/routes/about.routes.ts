import express from 'express';
import { multerUpload } from '../../../../../config/multer.config';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import { AboutController } from '../controller/about.controller';
import validateRequest from '../../../../middleware/validateRequest';
import { AboutValidations } from '../validations';
import { parseBody } from '../../../../middleware/bodyParser';

const router = express.Router();

// Create about (admin only)
router.post(
  '/create-about',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin),
  validateRequest(AboutValidations.create),
  AboutController.createAbout,
);

// Get about by domain (public)
router.get('/:domain', AboutController.getAbout);

// Get about by organization (admin only)
router.get(
  '/organization/current',
  auth(USER_ROLE.admin),
  AboutController.getAboutByOrganization,
);

// Update about (admin only)
router.put(
  '/update-about',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin),
  validateRequest(AboutValidations.update),
  AboutController.updateAbout,
);

// Delete about (admin only)
router.delete(
  '/delete/:id',
  auth(USER_ROLE.admin),
  AboutController.deleteAbout,
);

export const AboutRoutes = router;
