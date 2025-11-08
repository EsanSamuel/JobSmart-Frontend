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
  matchScore?: number;
  createdBy: user;
  Resume: resume[];
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

export interface user {
  username: string;
  email: string;
  role: "USER" | "COMPANY";
  id: string;
  uniqueName: string | null;
  profilePicture: string | null;
  hashedPassword: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  bio: string | null;
  profileImage: string | null;
}

export interface resume {
  id: string;
  createdAt: Date;
  embedding: number[];
  userId: string | null;
  jobId: string | null;
  fileUrl: string;
  parsedText: string;
  matchPercentage: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string | null;
}

export interface bookmark {
  id: string;
  jobId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
