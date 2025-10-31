import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../modules/global/user/user.constance';
import catchAsync from '../utils/catchAsynch';
import AppError from '../errors/AppError';
import { verifyToken } from '../modules/shared/auth/auth.utils';
import config from '../../config';
import { User } from '../modules/global/user/repository/schema/user.schema';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const blocked = user?.is_blocked;

    if (blocked) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are blocked !');
    }

    const isDeleted = user?.is_deleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'Your account deleted !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
