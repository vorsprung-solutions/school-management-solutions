import { Types } from 'mongoose';

export interface IExam {
  domain: string;
  subdomain: string;
  organization: Types.ObjectId;
  examName: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
