import { model, Schema, Types } from 'mongoose';
import { IUser, UserModel } from '../../interface/user.interface';
import { USER_ROLE } from '../../user.constance';
import bcrypt from 'bcrypt';
import config from '../../../../../../config';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    role: { type: String, enum: USER_ROLE, default: USER_ROLE.student },
    is_deleted: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
    next();
  } catch (error: any) {
    return next(error);
  }
});

// Method to find user by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

// Set password to an empty string after saving for security
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Method to compare password during login
userSchema.statics.isUserPasswordMatch = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// Export the user model
export const User = model<IUser, UserModel>('User', userSchema);
