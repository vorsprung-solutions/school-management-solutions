import { Types } from 'mongoose';

export type PayType = 'monthly_fee' | 'exam_fee' | 'form_fillup';
export type PayStatus = 'pending' | 'paid';

export interface IStudentPayment {
  student: Types.ObjectId;
  organization: Types.ObjectId;
  name: string;
  pay_type: PayType;
  amount: number;
  status: PayStatus;
  pay_date: Date;
  admit_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
