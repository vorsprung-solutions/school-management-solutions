import { Schema, model } from 'mongoose';
import { IOrganizationPayment } from '../../interface/or-payment.interface';

const organizationPaymentSchema = new Schema<IOrganizationPayment>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    subscription_status: {
      type: String,
      enum: ['monthly', 'lifetime'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pay_status: {
      type: String,
      enum: ['pending', 'paid'],
      required: true,
    },
    pay_date: {
      type: Date,
      required: true,
    },
    expire_at: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OrganizationPayment = model<IOrganizationPayment>(
  'OrganizationPayment',
  organizationPaymentSchema,
);
