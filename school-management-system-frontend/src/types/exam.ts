export interface IExam {
  _id?: string;
  domain: string;
  subdomain: string;
  organization?: string;
  examName: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExamData {
  examName: string;
}

export interface UpdateExamData {
  examName: string;
}
