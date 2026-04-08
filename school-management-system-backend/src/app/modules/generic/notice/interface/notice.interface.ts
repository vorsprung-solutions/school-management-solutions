import { Types } from 'mongoose';

export interface INotice {
  organization: Types.ObjectId;
  domain : string;
  subdomain : string;
  title: string;
  description: string;
  image: string;
  date?: string;
  priority?: string;
}
