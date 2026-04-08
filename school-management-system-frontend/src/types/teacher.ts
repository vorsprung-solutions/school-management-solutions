export interface ITeacher {
  _id: string;
  name: string;
  email: string;
  department: {
    _id: string;
    name: string;
  };
  designation: string;
  profilePicture?: string;
  user: {
    role: string;
    is_deleted: boolean;
    is_blocked: boolean;
    _id: string;
  };
}
// Form data type for creating banners (without _id)
export type TeacherFormData = Omit<ITeacher, "_id">;
