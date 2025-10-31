import { Types } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface IAttendance {
  _id?: string;
  student: Types.ObjectId;
  status: AttendanceStatus;
  date: Date;
  department: Types.ObjectId;
  group?: string;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extended interface for populated data
export interface IAttendanceWithDetails extends Omit<IAttendance, 'student' | 'department'> {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    roll: string;
    class: number;
    session: number;
    group?: string;
  };
  department: {
    _id: string;
    name: string;
  };
}

// Query interface for filtering
export interface IAttendanceQuery {
  search?: string;
  status?: AttendanceStatus;
  class?: number;
  session?: number;
  group?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
}
