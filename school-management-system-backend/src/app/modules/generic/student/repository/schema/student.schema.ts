import { model, Schema } from 'mongoose';
import { IStudent } from '../../interface/student.interface';

const studentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    ephone: { type: Number, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    roll_no: { type: Number, required: true, unique : true },
    reg_no: { type: Number, required: true, unique : true },
    class: { type: Number, required: true },
    group: { type: String, trim: true },
    session: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    dob: { type: Date, required: true },
    blood_group: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Student = model<IStudent>('Student', studentSchema);
