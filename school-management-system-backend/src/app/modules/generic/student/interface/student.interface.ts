import { Types } from 'mongoose';

export interface IStudent {
  user: Types.ObjectId;
  organization: Types.ObjectId;
  department: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  ephone: number;
  profilePicture?: string;
  roll_no: number;
  reg_no: number;
  class: number;
  group?: string;
  session: number;
  gender: 'Male' | 'Female';
  dob: Date;
  blood_group: string;
}
