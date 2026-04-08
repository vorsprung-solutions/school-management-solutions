import express from 'express';
import { OrganizationController } from '../controller/organization.controller';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { organizationValidations } from '../validations';
import { multerUpload } from '../../../../../config/multer.config';
import { parseBody } from '../../../../middleware/bodyParser';

const router = express.Router();

// Public route to get organization by domain (no auth required)
router.get(
  '/public/:domain',
  OrganizationController.getOrganizationByDomain,
);

// Get organization by current user (admin only)
router.get(
  '/current',
  auth(USER_ROLE.admin),
  OrganizationController.getOrganizationByUser,
);

// Get organization by ID (admin only)
router.get(
  '/:id',
  auth(USER_ROLE.admin),
  OrganizationController.getOrganizationById,
);

// Update organization (admin only)
router.put(
  '/update',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin),
  validateRequest(organizationValidations.update),
  OrganizationController.updateOrganization,
);

export default router;
