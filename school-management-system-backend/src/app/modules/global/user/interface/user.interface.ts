import { Model } from 'mongoose';
import { USER_ROLE } from '../user.constance';

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface IUser {
  _id?: string;
  organization?: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  profilePicture?: string;
  is_deleted: boolean;
  is_blocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
}
export interface ILoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser>;

  isUserPasswordMatch(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
