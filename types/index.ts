export interface job {
  id: string;
  title: string;
  company: string | null;
  maxApplicants: number;
  description: string;
  skills: string[];
  location: string | null;
  jobType: string;
  salaryRange: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isArchived: boolean;
  isClosed: boolean;
  embedding: number[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  Resume: {
    id: string;
    embedding: number[];
    createdAt: Date;
    fileUrl: string;
    parsedText: string;
    userId: string | null;
    jobId: string | null;
    matchPercentage: number | null;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string | null;
  }[];
}

export interface match {
  id: string;
  createdAt: Date;
  userId: string | null;
  jobId: string | null;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  resumeId: string | null;
}
