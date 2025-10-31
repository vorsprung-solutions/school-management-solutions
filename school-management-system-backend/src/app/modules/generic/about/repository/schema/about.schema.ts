import { model, Schema } from 'mongoose';
import { IAbout } from '../../interface/about.interface';

const aboutSchema = new Schema<IAbout>({
  image: {
    type: String,
    required: false,
  },
  domain: {
    type: String,
    required: true,
  },
  subdomain: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  stats: {
    student: { type: String, required: false },
    teacher: { type: String, required: false },
    year: { type: String, required: false },
    passPercentage: { type: String, required: false },
  },
  mapUrl: {
    type: String,
    required: false,
  },
  ejpublickey: {
    type: String,
    required: false
  },
  ejservicekey: {
    type: String,
    required: false
  },
  ejtemplateid: {
    type: String,
    required: false
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const About = model<IAbout>('About', aboutSchema);
