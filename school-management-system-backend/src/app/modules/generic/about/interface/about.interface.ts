import { Types } from 'mongoose';

export interface IAbout {
  image?: string;
  domain: string;
  subdomain: string;
  description?: string;
  stats?: {
    student: string;
    teacher: string;
    year: string;
    passPercentage: string;
  };
  mapUrl?: string;
  ejpublickey?: string;
  ejservicekey?: string;
  ejtemplateid?: string;
  organization: Types.ObjectId;
}
