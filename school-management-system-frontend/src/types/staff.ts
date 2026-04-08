export interface IStaff {
  _id: string;
  name: string;
  email: string;
  designation: string;
  phone: number;
  ephone: number;
  profilePicture?: string;
  quote: string;
  educationLevel: string;
  join_date : string;
  user: {
    role: string;
    is_deleted: boolean;
    is_blocked: boolean;
    _id: string;
  };
}
// Form data type for creating banners (without _id)
export type StaffFormData = Omit<IStaff, "_id">;
