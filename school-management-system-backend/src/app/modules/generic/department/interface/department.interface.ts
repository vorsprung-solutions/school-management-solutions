import { Types } from 'mongoose';

export interface IDepartment {
  domain : string;
  subdomain : string;
  name: string;
  organization: Types.ObjectId;
}
