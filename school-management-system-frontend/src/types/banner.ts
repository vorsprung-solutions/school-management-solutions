export interface IBanner {
  _id: string;
  image: string;
  domain: string;
  subdomain: string;
  title: string;
  subtitle: string;
  description: string;
}
// Form data type for creating banners (without _id)
export type BannerFormData = Omit<IBanner, "_id">