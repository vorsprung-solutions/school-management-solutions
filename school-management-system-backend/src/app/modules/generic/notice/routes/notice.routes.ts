import express from 'express';
import auth from '../../../../middleware/auth';
import { USER_ROLE } from '../../../global/user/user.constance';
import validateRequest from '../../../../middleware/validateRequest';
import { NoticeController } from '../controller/notice.controller';
import { NoticeValidations } from '../validations/notice.validations';
import { parseBody } from '../../../../middleware/bodyParser';
import { multerUpload } from '../../../../../config/multer.config';
const router = express.Router();

router.post(
  '/create-notice',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  validateRequest(NoticeValidations.create),
  NoticeController.createNotice,
);

router.get('/single/:id', NoticeController.getSingleNotice);

router.put(
  '/:id',
  multerUpload.single('file'),
  parseBody,
  auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.staff),
  validateRequest(NoticeValidations.update),
  NoticeController.updateNotice,
);

router.delete('/:id', auth(USER_ROLE.admin), NoticeController.deleteNotice);

router.get('/:domain', NoticeController.getAllNotice);

export const noticeRoutes = router;
