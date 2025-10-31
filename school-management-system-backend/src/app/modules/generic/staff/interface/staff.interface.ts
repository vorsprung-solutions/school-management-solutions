import { Types } from 'mongoose';

export interface IStaff {
  user: Types.ObjectId;
  organization: Types.ObjectId;
  designation: string;
  name: string;
  email: string;
  phone: number;
  ephone: number;
  profilePicture?: string;
  quote?: string;
  educationLevel? : string;
  join_date?: Date;
}
