"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import axios from "axios";

//https://jobsmart-backend.onrender.com

export function useApi() {
  const { data: session } = useSession();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://jobsmart-backend.onrender.com",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    instance.interceptors.request.use((config) => {
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
      return config;
    });

    return instance;
  }, [session]);

  return api;
}
