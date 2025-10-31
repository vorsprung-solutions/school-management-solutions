export type PlanType = 'monthly' | 'lifetime' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired';

export interface IOrganization {
  name: string;
  subdomain: string;
  customdomain: string;
  logo? : string;
  email: string;
  phone: number;
  ephone?: number;
  est?: string;
  social? : {
    facebook : string;
    youtube: string;
    instagram : string;
    twitter : string;
  }
  address: string;
  plan_type: PlanType;
  subscription_status: SubscriptionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  expire_at?: Date;
}
