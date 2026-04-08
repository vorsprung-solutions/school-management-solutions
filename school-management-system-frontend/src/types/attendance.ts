export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface IAttendance {
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
  status: AttendanceStatus;
  date: string;
  group?: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  presentPercentage: string;
  absentPercentage: string;
  latePercentage: string;
  leavePercentage: string;
}

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

export interface IAttendanceResponse {
  data: IAttendance[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAttendanceStatsResponse {
  data: IAttendanceStats;
}

export interface ICreateAttendanceData {
  student: string;
  status: AttendanceStatus;
  date: string;
  remark?: string;
}

export interface IUpdateAttendanceData {
  status?: AttendanceStatus;
  date?: string;
  remark?: string;
}
