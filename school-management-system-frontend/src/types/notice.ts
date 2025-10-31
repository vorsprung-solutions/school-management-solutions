export interface INotice {
  _id: string;
  image: string;
  domain: string;
  subdomain: string;
  title: string;
  description: string;
  date?: string;
  priority?: string;
}
// Form data type for creating banners (without _id)
export type NoticeFormData = Omit<INotice, "_id">;
