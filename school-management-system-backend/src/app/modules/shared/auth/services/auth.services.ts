import mongoose from 'mongoose';
import AppError from '../../../../errors/AppError';
import { Admin } from '../../../generic/admin/repository/schema/admin.schema';
import { IOrganization } from '../../../global/organization/interface/organization.interface';
import { Organization } from '../../../global/organization/repository/schema/organization.schema';
import { User } from '../../../global/user/repository/schema/user.schema';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import dayjs from 'dayjs';
import { USER_ROLE } from '../../../global/user/user.constance';
import {
  ILoginUser,
  IUser,
} from '../../../global/user/interface/user.interface';
import { createToken, verifyToken } from '../auth.utils';
import config from '../../../../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../../../utils/sendEmails';
import { TImageFile } from '../../../../interface/image.interface';

const createOrganization = async (
  file: TImageFile,
  organization: IOrganization,
) => {
  if (file) {
    const logo = file?.path;
    organization.logo = logo;
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const [emailExists, subdomainExists, customDomainExists] =
      await Promise.all([
        Organization.findOne({ email: organization?.email }),
        Organization.findOne({ subdomain: organization?.subdomain }),
        Organization.findOne({
          customdomain: organization?.customdomain,
        }),
      ]);

    if (emailExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Organization with this email already exists',
      );
    }

    if (subdomainExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Organization with this subdomain already exists',
      );
    }

    if (customDomainExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Organization with this custom domain already exists',
      );
    }

    let expire_at: Date;
    const now = new Date();

    switch (organization.plan_type) {
      case 'monthly':
        expire_at = dayjs(now).add(30, 'day').toDate();
        break;
      case 'yearly':
        expire_at = dayjs(now).add(1, 'year').toDate();
        break;
      case 'lifetime':
        expire_at = dayjs(now).add(100, 'year').toDate();
        break;
      default:
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid plan type');
    }

    const organizationWithExpiry = {
      ...organization,
      expire_at,
    };

    const password = organization.email;

    const createdOrganization = await Organization.create(
      [organizationWithExpiry],
      { session },
    );
    const org = createdOrganization[0];

    const userData = {
      email: organization.email,
      password: password,
      role: USER_ROLE.admin,
      name: organization.name,
      organization: org._id,
      profilePicture: '',
    };

    const createdUser = await User.create([userData], { session });
    const user = createdUser[0];

    await Admin.create(
      [
        {
          user: user._id,
          organization: org._id,
          name: org.name,
          email: user.email,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return org;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const loginUser = async (payload: ILoginUser) => {
  const user: IUser = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  if (user.is_deleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your account is deleted');
  }
  if (user.is_blocked) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your account is blocked');
  }

  if (!(await User.isUserPasswordMatch(payload?.password, user?.password))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Incorrect password');
  }

  // access Granted token and refresh token;
  //   create token and sent to the client

  const jwtPayload: any = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
    name: user?.name,
    organization: user?.organization,
    profilePicture: user?.profilePicture || '',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refrsh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  const isDeleted = user?.is_deleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted !');
  }

  const userStatus = user?.is_blocked;

  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked !');
  }

  //checking if the password is correct

  if (!(await User.isUserPasswordMatch(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password is incorrect !');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: userData?.email,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.is_deleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted ! !');
  }

  // checking if the user is blocked
  const userStatus = user?.is_blocked;

  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload: any = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
    name: user?.name,
    profilePicture: user?.profilePicture,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userEmail: string) => {
  const user = await User.isUserExistsByEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found !');
  }
  const isDeleted = user?.is_deleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted ! !');
  }

  const userStatus = user?.is_blocked;

  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked !');
  }

  const jwtPayload: any = {
    id: user?._id,
    email: user?.email,
    role: user?.role,
    name: user?.name,
    profilePicture: user?.profilePicture,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  const resetUILink = `${config.reset_pass_ui_link}/reset-password?email=${user.email}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);

  // console.log(resetUILink);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found !');
  }
  const isDeleted = user?.is_deleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is already deleted ! !');
  }

  // checking if the user is blocked
  const userStatus = user?.is_blocked;

  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  createOrganization,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
