"use client";
import React, { useContext, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Sparkles,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UserContext } from "@/app/context/userContext";
import axios from "axios";
import { ScrollArea } from "./ui/scroll-area";
import { job, match } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { responseList } from "@/lib/response";

interface IJob {
  job: job;
}

const Compatibility = ({ job }: IJob) => {
  const api = useApi();
  const { data: session } = useSession();
  const { user } = useContext(UserContext) as any;
  const [file, setFile] = useState<File | null>();
  const [isMatched, setIsMatched] = useState(false);
  const [match, setMatch] = useState<match>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isProfileMatching, setIsProfileMatching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    isPending: loadingResume,
    error: resumeError,
    data: resumes,
  } = useQuery({
    queryKey: ["resumes", job?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/jobs/resume/${job?.id}`);
      return responseList(response);
    },
  });

  const hasApplied = useMemo(() => {
    const resume = resumes?.map((resume: any) => resume.user.id);
    return resume?.includes(user.id);
  }, [resumes]);

  const matchResume = async () => {
    if (!job.id || !file || isLoading || isProfileMatching) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("authId", user.id);
      formData.append("CV", file);

      const response = await axios.post(
        `https://jobsmart-backend.onrender.com/api/v1/match/${job.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setMatch(response.data.data);
      setIsMatched(true);
    } catch {
      toast.error("We couldn’t analyze this resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      "https://jobsmart-backend.onrender.com/api/v1/jobs/submit-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    console.log(response.data.data);
    if (response.status === 201 || response.status === 200){
      toast.success("You have applied successfully!");
    } else {
      toast.error("Something went wrong");
    }
  };

  const matchProfileResume = async () => {
    if (!job.id || isLoading || isProfileMatching) return;

    setIsProfileMatching(true);
    try {
      const formData = new FormData();
      formData.append("authId", user.id);
      formData.append("resumeId", user.id);

      const response = await axios.post(
        `https://jobsmart-backend.onrender.com/api/v1/match/${job.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setMatch(response.data.data);
      setIsMatched(true);
    } catch {
      toast.error("We couldn’t analyze your profile resume. Please try again.");
    } finally {
      setIsProfileMatching(false);
    }
  };

  const selectResume = (candidate?: File) => {
    if (!candidate) return;
    const extension = candidate.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
      setFile(null);
      setFileError("Choose a PDF, DOC, or DOCX file.");
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      setFile(null);
      setFileError("This file is larger than 10 MB. Choose a smaller resume.");
      return;
    }
    setFile(candidate);
    setFileError("");
  };

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

              <label
                htmlFor="compatibility-resume-file"
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setIsDragging(false);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  selectResume(event.dataTransfer.files?.[0]);
                }}
                className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : file
                      ? "border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50"
                      : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60"
                }`}
              >
                <div className={`mb-3 flex size-11 items-center justify-center rounded-xl transition-colors ${file ? "bg-emerald-100 text-emerald-700" : "bg-white text-blue-700 shadow-sm group-hover:bg-blue-100"}`}>
                  {file ? <CheckCircle2 className="size-5" /> : <Upload className="size-5" />}
                </div>
                {file ? (
                  <>
                    <p className="max-w-full truncate text-sm font-semibold text-slate-800">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB · Click or drop to replace
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-blue-700">Choose a resume</span> or drag it here
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500">PDF, DOC, or DOCX · Up to 10 MB</p>
                  </>
                )}
                <Input
                  ref={fileInputRef}
                  id="compatibility-resume-file"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => selectResume(event.target.files?.[0])}
                  aria-describedby={fileError ? "resume-file-error" : undefined}
                />
              </label>
              {fileError && (
                <p id="resume-file-error" role="alert" className="mt-2 text-sm text-red-600">
                  {fileError}
                </p>
              )}

              <Button
                className="h-11 w-full rounded-xl font-semibold shadow-sm transition-all"
                disabled={!file || isLoading || isProfileMatching}
                onClick={matchResume}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 size-4 animate-spin" />Analyzing resume…</>
                ) : (
                  <><Sparkles className="mr-2 size-4" />Analyze with AI</>
                )}
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
                  className="h-10 w-full rounded-xl"
                  onClick={matchProfileResume}
                  disabled={isLoading || isProfileMatching}
                >
                  {isProfileMatching ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" />Using profile resume…</>
                  ) : (
                    <><FileText className="mr-2 size-4" />Use Profile Resume</>
                  )}
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
        <Button
          className="w-full mt-5"
          onClick={submitResume}
          disabled={isLoading2}
        >
          {isLoading2 ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              Applying
            </>
          ) : (
            "Apply"
          )}
        </Button>
      )}
    </DialogContent>
  );
};

export default Compatibility;
