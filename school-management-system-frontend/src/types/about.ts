export interface IAbout {
  _id: string;
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
  organization: {
    _id: string;
    name: string;
    subdomain: string;
    customdomain?: string;
    logo?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Form data type for creating/updating about (without _id and timestamps)
export type AboutFormData = Omit<IAbout, "_id" | "createdAt" | "updatedAt" | "organization" | "domain" | "subdomain">;
