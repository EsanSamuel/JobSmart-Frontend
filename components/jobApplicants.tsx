"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  FileText,
  Mail,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { applicants } from "@/app/libs/dummyData";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import ApplicantDataModal from "./ApplicantDataModal";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";

interface Ijobs {
  job: {
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
    Resume: {
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
    }[];
  };

  index?: number;
  jobResumes: {
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
  }[];
}

export default function Applicants({ job, jobResumes }: Ijobs) {
  const [isOpen, setIsOpen] = React.useState(true);
  const totalApplicants = jobResumes?.length || 0;

  const applicantsMinusFirst = jobResumes;

  const {
    isPending: loadingResume,
    error: resumeError,
    data: resumes,
  } = useQuery({
    queryKey: ["resumes", job.id],
    queryFn: async () => {
      if (!job?.id) return null;
      const response = await api.get(`/api/v1/jobs/resume/${job?.id}`);
      console.log("Applied", response.data.data);
      return response.data.data.result;
    },
    enabled: !!job?.id,
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full ">
      <div className="bg-white rounded-xl -sm hover:shadow-md transition-all overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-linear-to-r from-blue-50 to-white">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">
                {job.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                >
                  {totalApplicants}{" "}
                  {totalApplicants === 1 ? "Applicant" : "Applicants"}
                </Badge>
              </div>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 hover:bg-blue-100 transition-colors"
            >
              <ChevronsUpDown
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
              <span className="sr-only">Toggle applicants</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="space-y-3 mt-3">
        {applicantsMinusFirst?.map((applicant: any, idx: number) => (
          <div
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            key={idx}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={applicant?.user?.profileImage}
                      alt={applicant?.user?.username}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-3 items-center">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {applicant?.user?.username}
                      </h3>
                      <Badge
                        className={
                          applicant?.matchPercentage >= 80
                            ? "bg-green-100 text-green-700 border-green-200"
                            : applicant?.matchPercentage >= 50
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {applicant.matchPercentage}% match
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-sm text-gray-600 truncate">
                        {applicant?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="justify-end items-end flex">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="lg:block md:block hidden">View</span>
                      </Button>
                    </DialogTrigger>
                    <ApplicantDataModal match={applicant} job={job} />
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// Helper function for gradient colors
function getGradientColors(index: number): string {
  const gradients = [
    "#667eea, #764ba2",
    "#f093fb, #f5576c",
    "#4facfe, #00f2fe",
    "#43e97b, #38f9d7",
    "#fa709a, #fee140",
    "#30cfd0, #330867",
    "#a8edea, #fed6e3",
    "#ff9a56, #ff6a88",
  ];
  return gradients[index % gradients.length];
}
