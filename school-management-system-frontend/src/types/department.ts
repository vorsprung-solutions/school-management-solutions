export interface IDepartment {
  _id: string; 
  domain: string;
  subdomain: string;
  name: string; 
  organizaton : string;
}
// Form data type for creating banners (without _id)
export type BannerFormData = Omit<IDepartment, "_id">;
