import { model, Schema } from 'mongoose';
import { IAdmin } from '../../interface/admin.interface';

const adminSchema = new Schema<IAdmin>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    join_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Admin = model<IAdmin>('Admin', adminSchema);
