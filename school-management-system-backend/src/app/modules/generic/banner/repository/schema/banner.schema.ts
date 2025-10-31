import { model, Schema } from 'mongoose';
import { IBanner } from '../../interface/banner.interface';

const bannerSchema = new Schema<IBanner>({
  domain: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  subdomain: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export const Banner = model<IBanner>('Banner', bannerSchema);
