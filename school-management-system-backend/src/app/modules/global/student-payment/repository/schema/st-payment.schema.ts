import { Schema, model } from 'mongoose';
import { IStudentPayment } from '../../interface/st-payment.interface';

const studentPaymentSchema = new Schema<IStudentPayment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    pay_type: {
      type: String,
      enum: ['monthly_fee', 'exam_fee', 'form_fillup'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      required: true,
    },
    pay_date: {
      type: Date,
      required: true,
    },
    admit_url: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const StudentPayment = model<IStudentPayment>(
  'StudentPayment',
  studentPaymentSchema,
);
