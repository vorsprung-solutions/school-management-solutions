export enum GradeEnum {
  A_PLUS = 'A+',
  A = 'A',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B = 'B',
  B_MINUS = 'B-',
  C_PLUS = 'C+',
  C = 'C',
  C_MINUS = 'C-',
  D_PLUS = 'D+',
  D = 'D',
  F = 'F',
}

export interface SubjectResult {
  subject: string;
  marks: number;
  grade: GradeEnum;
  gpa: number;
}

export interface IResult {
  _id?: string;
  student: string | IStudent;
  organization?: string;
  exam: string | IExam;
  year: number;
  class: number;
  session: number;
  group?: string;
  results: SubjectResult[];
  total_marks: number;
  gpa: number;
  grade: GradeEnum;
  is_passed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStudent {
  _id: string;
  name: string;
  roll_no?: number;
  reg_no?: number;
  // Fallback field names for compatibility
  rollNumber?: number;
  roll?: number;
  regNumber?: number;
  registration_no?: number;
}

export interface IExam {
  _id: string;
  examName: string;
}

export interface CreateResultData {
  exam: string;
  student: string;
  year: number;
  class: number;
  session: number;
  group?: string;
  results: SubjectResult[];
  total_marks?: number;
  gpa: number;
  grade: GradeEnum;
  is_passed: boolean;
}

export interface UpdateResultData {
  exam?: string;
  student?: string;
  year?: number;
  class?: number;
  session?: number;
  group?: string;
  results?: SubjectResult[];
  total_marks?: number;
  gpa?: number;
  grade?: GradeEnum;
  is_passed?: boolean;
}

export interface ResultFilters {
  exam?: string;
  student?: string;
  year?: number;
  class?: number;
  session?: number;
  group?: string;
  page?: number;
  limit?: number;
}

export interface ResultStatistics {
  totalResults: number;
  averageGPA: number;
  passedCount: number;
  failedCount: number;
}
