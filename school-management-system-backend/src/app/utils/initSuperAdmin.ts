// src/app/utils/initSuperAdmin.ts

import config from '../../config';
import { SuperAdmin } from '../modules/generic/super-admin/repository/schema/super-admin.schema';
import { User } from '../modules/global/user/repository/schema/user.schema';
import { USER_ROLE } from '../modules/global/user/user.constance';

export const initSuperAdmin = async () => {
  const existingSuperAdmin = await SuperAdmin.findOne({
    email: config.super_admin_email,
  });

  if (existingSuperAdmin) {
    console.log('✅ Super Admin already exists');
    return;
  }

  // Step 1: Create User
  const user = await User.create({
    email: config.super_admin_email,
    password: config.super_admin_password,
    role: USER_ROLE.super_admin,
    name: config.super_admin_name,
  });

  // Step 2: Create SuperAdmin document
  await SuperAdmin.create({
    user: user._id,
    name: config.super_admin_name,
    email: config.super_admin_email,
  });

  console.log('🚀 Super Admin created successfully');
};
