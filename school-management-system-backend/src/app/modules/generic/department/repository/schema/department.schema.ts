import { model, Schema } from 'mongoose';
import { IDepartment } from '../../interface/department.interface';

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Department = model<IDepartment>('Department', departmentSchema);
