import { model, Schema } from 'mongoose';
import { ISuperAdmin } from '../../interface/super-admin.interface';

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SuperAdmin = model<ISuperAdmin>('SuperAdmin', superAdminSchema);
