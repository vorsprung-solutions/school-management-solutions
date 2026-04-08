import express from 'express';
import { StaffControllers } from '../controller/staff.controller';
import { multerUpload } from '../../../../../config/multer.config';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest'; 
import { parseBody } from '../../../../middleware/bodyParser';
import { StaffValidations } from '../validatons';

const router = express.Router();

// Get single staff
router.get('/single/:id', StaffControllers.getSingleStaff);

// Get all staff by domain
router.get('/:domain', StaffControllers.getAllStaffs);

// Get all staff by organization
router.get('/organization/:id', StaffControllers.getAllStaffsByOrganization);

// Update staff (self update, role = staff)
router.put(
  '/',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.staff),
  validateRequest(StaffValidations.update),
  StaffControllers.updateStaff,
);

// Update staff (by admin)
router.put(
  '/:id',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin),
  validateRequest(StaffValidations.update),
  StaffControllers.updateStaffByAdmin,
);

// Delete staff (soft delete / toggle is_deleted)
router.delete('/delete/:id', StaffControllers.deleteStaffByUserId);

// Block staff
router.delete('/block/:id', StaffControllers.blockStaffByUserId);

export const StaffRoutes = router;
