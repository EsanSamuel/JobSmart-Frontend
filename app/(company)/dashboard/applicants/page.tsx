"use client";
import api from "@/app/libs/axios";
import { applicants, data } from "@/app/libs/dummyData";
import ApplicantsCard from "@/components/applicantsCard";
import CompanyJobsCard from "@/components/CompanyJobs";
import DashboardNav from "@/components/dashboardNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const { data: session } = useSession();
  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };

  const {
    isPending,
    error,
    data: jobs,
  } = useQuery({
    queryKey: ["jobs", session?.user.id],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/jobs/company/${session?.user.id}`
      );
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (!jobs) {
    return (
      <div className="h-screen flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-500">No Applicants</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <SidebarInset className="bg-white h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <DashboardNav />
        </header>
        <div className="flex flex-col w-full  lg:p-10 p-5 min-h-0 ">
          <div className="pb-5 ">
            <h1 className="text-3xl font-bold mb-5 text-gray-800">
              All Applicants
            </h1>
          </div>
          <div
            className="flex-1 overflow-y-auto custom-scrollbar pr-2"
            style={scrollbarStyles as any}
          >
            <div className="space-y-4 overflow-y-auto">
              {jobs?.map((job, index) => (
                <div className="" key={index}>
                  <ApplicantsCard job={job} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};
export default Page;
