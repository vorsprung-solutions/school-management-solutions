import { Types } from 'mongoose';

export interface ITeacher {
  user: Types.ObjectId;
  organization: Types.ObjectId;
  department: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  ephone?: number;
  profilePicture?: string;
  qualification: string;
  quote? : string;
  designation: string;
  join_date: Date;
  blood_group?: string;
}
