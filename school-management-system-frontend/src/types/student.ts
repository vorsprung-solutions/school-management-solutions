export interface IPublicStudentQuery {
  page?: number;
  limit?: number;
  search?: string;
  class?: string | number;
  session?: string | number;
  department?: string;
  gender?: string;
  group?: string;
}

export interface IStudent {
  _id: string;
  name: string;
  user?: {
    _id: string;
    email: string;
    is_deleted?: boolean;
    is_blocked?: boolean;
  };
  email: string;
  phone?: string;
  ephone?: string;
  profilePicture?: string;
  roll_no?: string | number;
  reg_no?: string | number;
  class: number;
  group?: string;
  session: number;
  gender: "Male" | "Female";
  dob?: string;
  blood_group?: string;
  organization: {
    _id: string;
    name: string;
    subdomain?: string;
    customdomain?: string;
    logo?: string;
  };
  department: {
    _id: string;
    name: string;
  };
}

export interface IPublicStudentsResponse {
  data: IStudent[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type StudentFormData = Omit<IStudent, "_id">;
