import { model, Schema } from 'mongoose';
import { INotice } from '../../interface/notice.interface';

const noticeSchema = new Schema<INotice>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    domain: { type: String, required: true },
    subdomain: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    image: { type: String },
    date: { 
      type: String, 
      default: () => new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    },
    priority: { 
      type: String, 
      enum: ['normal', 'low', 'medium', 'high'],
      default: 'normal'
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Notice = model<INotice>('Notice', noticeSchema);
