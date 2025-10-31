import { model, Schema } from 'mongoose';
import { IStaff } from '../../interface/staff.interface';

const staffSchema = new Schema<IStaff>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    designation: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    ephone: { type: Number, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    educationLevel : {type : String},
    quote : {type : String},
    join_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Staff = model<IStaff>('Staff', staffSchema);
