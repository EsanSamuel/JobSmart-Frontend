"use client";
import api from "@/app/libs/axios";
import { applicants, data } from "@/app/libs/dummyData";
import ApplicantsCard from "@/components/applicantsCard";
import CompanyJobsCard from "@/components/CompanyJobs";
import DashboardNav from "@/components/dashboardNav";
import Applicants from "@/components/jobApplicants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2, Search } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [progress, setProgress] = React.useState(13);
  const [filterResume, setFilterResume] = useState("ALL");

  const {
    isPending,
    error,
    data: job,
  } = useQuery({
    queryKey: ["Alljobs", id],
    queryFn: async () => {
      if (!id) return;
      const response = await api.get(`/api/v1/jobs/${id}`);
      console.log("Job:", response.data.data);
      return response.data.data;
    },
    enabled: !!id,
  });

  const {
    isPending: isLoadingResumes,
    error: resumeError,
    data: resumeData,
  } = useQuery({
    queryKey: ["job-resumes", job?.id],
    queryFn: async () => {
      if (!job?.id) return null;
      const response = await api.get(`/api/v1/jobs/resume/${job?.id}`);
      console.log("Applied", response.data.data);
      return response.data.data;
    },
    enabled: !!job?.id,
  });

  const filteredResumes = useMemo(() => {
    if (!resumeData) return [];

    switch (filterResume) {
      case "BEST_FITS":
        return resumeData.BestFits;
      case "POTENTIAL_FITS":
        return resumeData.PotentialFits;
      case "UNLIKELY_FITS":
        return resumeData.UnlikelyFits;
      case "ALL":
      default:
        return resumeData.filterResumeByAIscore;
    }
  }, [resumeData, filterResume]);

  const filterShortListedApplicant = filteredResumes?.filter(
    (resume: any) => resume.status === "ShortListed"
  );

  const totalApplicants = filterShortListedApplicant?.length ?? 0;

  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };

  if (!job) {
    return (
      <div className="h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-gray-500">No Job</p>
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
          <div className="pb-5 lg:flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-5 text-gray-800">
              Shortlisted Applicants ({totalApplicants})
            </h1>
            <Select
              value={filterResume}
              onValueChange={(value) => setFilterResume(value)}
            >
              <SelectTrigger className="w-full sm:w-[220px] h-11">
                <SelectValue placeholder="Filter based on AI match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Candidates</SelectItem>
                <SelectItem value="BEST_FITS">
                  Best Fits{" "}
                  <Badge className="bg-green-100 text-green-600 border-green-200">
                    80%+ match
                  </Badge>
                </SelectItem>
                <SelectItem value="POTENTIAL_FITS">
                  Potential Fits{" "}
                  <Badge className="bg-amber-100 text-amber-600 border-amber-200">
                    50%+ match
                  </Badge>
                </SelectItem>
                <SelectItem value="UNLIKELY_FITS">
                  Unlikely Fits{" "}
                  <Badge className="bg-red-100 text-red-600 border-red-200">
                    50%- match
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            className="flex-1 overflow-y-auto custom-scrollbar pr-2"
            style={scrollbarStyles as any}
          >
            <div
              className="flex-1 overflow-y-auto custom-scrollbar pr-2"
              style={scrollbarStyles as any}
            >
              <div className="space-y-4">
                {isLoadingResumes ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      <p className="text-gray-500">Loading applicants...</p>
                    </div>
                  </div>
                ) : resumeError ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <p className="text-red-500 font-semibold mb-2">
                        Error loading applicants
                      </p>
                      <p className="text-gray-500 text-sm">
                        {resumeError instanceof Error
                          ? resumeError.message
                          : "Unknown error"}
                      </p>
                    </div>
                  </div>
                ) : filteredResumes?.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">
                      No applicants found for this filter
                    </p>
                  </div>
                ) : (
                  <Applicants
                    job={job}
                    jobResumes={filterShortListedApplicant}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};
export default Page;
