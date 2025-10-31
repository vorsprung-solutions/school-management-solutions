import { Router } from 'express';
import { AuthRoutes } from '../modules/shared/auth/routes/auth.routes';
import { DepartmentRoutes } from '../modules/generic/department/routes/department.routes';
import { UserRoutes } from '../modules/global/user/routes/user.routes';
import { StudentRoutes } from '../modules/generic/student/routes/student.routes';
import { TeacherRoutes } from '../modules/generic/teacher/routes/teacher.routes';
import { noticeRoutes } from '../modules/generic/notice/routes/notice.routes';
import { AttendanceRoutes } from '../modules/generic/attendance/routes/attendance.routes';
import { AboutRoutes } from '../modules/generic/about/routes/about.routes';
import { BannerRoutes } from '../modules/generic/banner/routes/banner.routes';
import { ExamRoutes } from '../modules/generic/exam/routes/exam.routes';
import { ResultRoutes } from '../modules/generic/result/routes/result.routes';
import { StaffRoutes } from '../modules/generic/staff/routes/staff.routes';
import OrganizationRoutes from '../modules/global/organization/routes/organization.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/department',
    route: DepartmentRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/teacher',
    route: TeacherRoutes,
  },
  {
    path: '/exam',
    route: ExamRoutes,
  },
  {
    path: '/result',
    route: ResultRoutes,
  },
  {
    path: '/staff',
    route: StaffRoutes,
  },
  {
    path: '/notice',
    route: noticeRoutes,
  },
  {
    path: '/attendance',
    route: AttendanceRoutes,
  },
  {
    path: '/about',
    route: AboutRoutes,
  },
  {
    path: '/banner',
    route: BannerRoutes,
  },
  {
    path : '/organization',
    route : OrganizationRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;