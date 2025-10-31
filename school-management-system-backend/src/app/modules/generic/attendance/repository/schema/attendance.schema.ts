import { Schema, model } from 'mongoose';
import { IAttendance } from '../../interface/attendance.interface';
 

const attendanceSchema = new Schema<IAttendance>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'leave'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  group: { 
    type: String, 
    trim: true 
  },
  remark: { 
    type: String, 
    trim: true 
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
