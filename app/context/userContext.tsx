"use client";
import api from "@/app/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IUser {
  user: {
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
  };
  jobs: {
    title: string;
    maxApplicants: number;
    description: string;
    skills: string[];
    location: string | null;
    jobType: string;
    salaryRange: string | null;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    company: string | null;
    isArchived: boolean;
    embedding: number[];
    createdById: string;
  };
  bookmarks: {
    id: string;
    jobId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  appliedJobs: {
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
  };
  matchedJobs: {
    id: string;
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
    createdAt: Date;
    jobId: string | null;
    userId: string | null;
    resumeId: string | null;
  };
  loadingJobs: boolean;
}

export const UserContext = createContext<IUser | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const {
    isPending,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user", session?.user.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/users/${session?.user.id}`);
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

  const {
    isPending: loadingJobs,
    error: isError,
    data: jobs,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get(`/api/v1/jobs`);
      return response.data.data;
    },
  });

  const {
    isPending: loadingBookmarks,
    error: bookmarkError,
    data: bookmarks,
  } = useQuery({
    queryKey: ["bookmarks", session?.user?.id],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/bookmarks/user/${session?.user?.id}`
      );
      return response.data.data;
    },
  });

  const {
    isPending: loadingAppliedJobs,
    error: appliedJobsError,
    data: appliedJobs,
  } = useQuery({
    queryKey: ["applied_jobs", session?.user?.id],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/users/applied-jobs/${session?.user?.id}`
      );
      return response.data.data;
    },
  });

  const {
    isPending: loadingMatchedJobs,
    error: appliedJobkError,
    data: matchedJobs,
  } = useQuery({
    queryKey: ["matched_jobs", session?.user?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/match/user/${session?.user?.id}`);
      return response.data.data;
    },
  });

  return (
    <UserContext.Provider
      value={{ user, jobs, loadingJobs, bookmarks, appliedJobs, matchedJobs }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
