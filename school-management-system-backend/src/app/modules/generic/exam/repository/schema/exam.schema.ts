import { model, Schema } from 'mongoose';
import { IExam } from './../../interface/exam.interface';

const examSchema = new Schema<IExam>(
  {
    domain: {
      type: String,
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
    },
    examName: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Exam = model<IExam>('Exam', examSchema);
