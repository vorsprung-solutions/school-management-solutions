import { Types } from 'mongoose';

export interface IAdmin {
  user: Types.ObjectId;
  organization: Types.ObjectId;
  name: string;
  email: string;
  join_date?: Date;
}
