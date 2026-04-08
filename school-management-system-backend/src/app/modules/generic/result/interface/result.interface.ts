import { Types } from 'mongoose';

// Enum for grade values
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

export interface IResult {
  student: Types.ObjectId;
  organization: Types.ObjectId;
  exam: Types.ObjectId; // Reference to exam instead of exam_name string
  year: number;
  class: number;
  session: number;
  group?: string;
  
  results: {
    subject: string;
    marks: number;
    grade: GradeEnum;
    gpa: number;
  }[];

  total_marks: number;
  gpa: number;
  grade: GradeEnum;
  is_passed: boolean;
}
