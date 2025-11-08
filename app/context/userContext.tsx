"use client";
import api from "@/app/libs/axios";
import { bookmark, job, match, resume, user } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IUser {
  user: user;
  jobs: job[];
  bookmarks: bookmark[];
  appliedJobs: resume;
  matchedJobs: match;
  AIRecommendedJobs: job[];
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
      console.log(response.data.data);
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

  const {
    isPending: loadingRecommendedJobs,
    error: recommendedJobsError,
    data: AIRecommendedJobs,
  } = useQuery({
    queryKey: ["recommended_jobs", session?.user?.id],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/jobs/ai-recommedation/${session?.user?.id}`
      );
      console.log(response);
      return response.data.data;
    },
  });

  return (
    <UserContext.Provider
      value={{
        user,
        jobs,
        loadingJobs,
        bookmarks,
        appliedJobs,
        matchedJobs,
        AIRecommendedJobs,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
