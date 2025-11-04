"use client";
import React, { useContext, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Sparkles, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UserContext } from "@/app/context/userContext";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";
import { match } from "@/types";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";

interface IJob {
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
  };
}

const Compatibility = ({ job }: IJob) => {
  const { user } = useContext(UserContext) as any;
  const [file, setFile] = useState<File | null>();
  const [isMatched, setIsMatched] = useState(false);
  const [match, setMatch] = useState<match>();
  const [progress, setProgress] = React.useState(13);

  const {
    isPending: loadingResume,
    error: resumeError,
    data: resumes,
  } = useQuery({
    queryKey: ["resumes", job?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/jobs/resume/${job?.id}`);
      console.log("Applied", response.data.data);
      return response.data.data.result;
    },
  });

  const hasApplied = useMemo(() => {
    const resume = resumes?.map((resume: any) => resume.user.id);
    return resume?.includes(user.id);
  }, [resumes]);

  const matchResume = async () => {
    if (!job.id) {
      return null;
    }

    const formData = new FormData();
    formData.append("authId", user.id);
    if (file) {
      formData.append("CV", file);
    }

    const response = await axios.post(
      `http://localhost:5000/api/v1/match/${job.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setIsMatched(true);
    setMatch(response.data.data);
    console.log(response.data.data);
  };

  const submitResume = async () => {
    if (!job.id) {
      return null;
    }

    const formData = new FormData();
    formData.append("authId", user.id);
    formData.append("jobId", job.id);

    if (file) {
      formData.append("CV", file);
    }

    const response = await axios.post(
      "http://localhost:5000/api/v1/jobs/submit-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data.data);
  };

  const matchProfileResume = async () => {
    if (!job.id) {
      return null;
    }

    const formData = new FormData();
    formData.append("authId", user.id);
    formData.append("resumeId", user.id);
    if (file) {
      formData.append("CV", file);
    }

    const response = await axios.post(
      `http://localhost:5000/api/v1/match/${job.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setIsMatched(true);
    setMatch(response.data.data);
    console.log(response.data.data);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 items-start justify-start">
            <DialogTitle className="lg:text-2xl text-[16px] font-bold text-gray-900 text-start">
              Check Job Compatibility
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1 text-start">
              Let AI analyze your resume and predict your match score
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="h-[65vh]">
        {!isMatched ? (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Upload className="h-4 w-4" />
                <span>Upload Resume</span>
              </div>

              <div className="relative">
                <label
                  htmlFor="pdf"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 mb-3 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="mb-2 text-sm text-gray-600 font-medium">
                      <span className="text-blue-600">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX (MAX. 10MB)
                    </p>
                    {file && (
                      <div className="mt-3 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700 font-medium">
                          {file.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="pdf"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <Button
                className="w-full h-11 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={!file}
                onClick={matchResume}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze with AI
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-3 text-xs text-gray-500 font-medium uppercase">
                  Or
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                <span>Quick Option</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Profile Resume Available
                    </h4>
                    <p className="text-xs text-gray-600">
                      Use the resume from your profile for instant analysis
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10"
                  onClick={matchProfileResume}
                >
                  Use Profile Resume
                </Button>
              </div>
            </div>

            <div className="bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    AI-Powered Analysis
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Our AI will analyze your skills, experience, and
                    qualifications to calculate your compatibility score with
                    this job posting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-5 gap-3">
            <div className="w-30 h-30">
              <CircularProgressbar
                value={match?.matchPercentage as number}
                text={`${match?.matchPercentage}%`}
              />
              ;
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col mt-2">
                <h1 className="text-gray-700 text-start font-semibold pb-3">
                  Summary
                </h1>
                <p className="text-sm text-gray-600">{match?.summary}</p>
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-700 text-start font-semibold pb-3">
                  Missing skills
                </h1>
                <ul className="grid grid-cols-2 space-y-2">
                  {match?.missingSkills.map((skills: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 w-full">
                      <div className="w-2 h-2 text-green-500 rounded-full mt-2">
                        *
                      </div>
                      <span className="text-gray-600 text-sm">{skills}</span>
                    </div>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-gray-700 text-start font-semibold pb-3">
                Match skills
              </h1>
              <ul className="grid grid-cols-2 space-y-2">
                {match?.matchedSkills.map((skills: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 w-full">
                    <div className="w-2 h-2 text-green-500 rounded-full mt-2">
                      *
                    </div>
                    <span className="text-gray-600 text-sm">{skills}</span>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </ScrollArea>
      {hasApplied ? (
        <Button className="w-full mt-5" disabled>
          You have already applied
        </Button>
      ) : (
        <Button className="w-full mt-5" onClick={submitResume}>
          Apply
        </Button>
      )}
    </DialogContent>
  );
};

export default Compatibility;
