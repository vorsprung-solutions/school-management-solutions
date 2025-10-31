import { model, Schema } from 'mongoose'; 
import { ITeacher } from '../../inteface/tacher.interface';

const teacherSchema = new Schema<ITeacher>(
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

    email: { type: String, required: true, trim: true, lowercase: true, unique: true },

    phone: { type: Number, required: true, unique: true },

    ephone: { type: Number, required: false },  

    profilePicture: { type: String, default: '' },

    qualification: { type: String, required: false, trim: true },

    quote: { type: String, required: false, trim: true },  

    designation: { type: String, required: true, trim: true },

    join_date: { type: Date, required: true, default: Date.now },

    blood_group: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Teacher = model<ITeacher>('Teacher', teacherSchema);
