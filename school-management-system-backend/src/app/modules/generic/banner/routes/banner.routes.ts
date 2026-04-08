import express from 'express';
import { multerUpload } from '../../../../../config/multer.config';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import { BannerController } from '../controllers/banner.controllers';

const router = express.Router();

router.post(
  '/create-banner',
  multerUpload.single('file'),
  auth(USER_ROLE.admin),
  BannerController.createBanner,
);
router.put(
  '/:id',
  multerUpload.single('file'),
  auth(USER_ROLE.admin),
  BannerController.updateBanner,
);

router.get('/:domain', BannerController.getAllBanner);
router.get('/single/:id', BannerController.getBannerById);

router.delete('/:id', auth(USER_ROLE.admin), BannerController.deleteBanner);

export const BannerRoutes = router;
