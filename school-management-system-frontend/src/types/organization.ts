export interface IOrganization {
  _id: string;
  name: string;
  subdomain: string;
  customdomain?: string;
  logo?: string;
  email: string;
  phone: number;
  ephone?: number;
  est?: string;
  social?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  address: string;
  plan_type: 'monthly' | 'lifetime' | 'yearly';
  subscription_status: 'active' | 'expired';
  expire_at?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data type for updating organization (without _id and timestamps)
export type OrganizationFormData = Omit<IOrganization, '_id' | 'createdAt' | 'updatedAt'>;
