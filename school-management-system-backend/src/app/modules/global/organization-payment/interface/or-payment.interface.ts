import { Types } from 'mongoose';

export type SubscriptionStatus = 'monthly' | 'lifetime';
export type PaymentStatus = 'pending' | 'paid';

export interface IOrganizationPayment {
  organization: Types.ObjectId;
  subscription_status: SubscriptionStatus;
  amount: number;
  pay_status: PaymentStatus;
  pay_date: Date;
  expire_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
