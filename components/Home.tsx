"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { data } from "../app/libs/dummyData";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import Compatability from "./check-compatability";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Drawer, DrawerTrigger } from "./ui/drawer";
import MobileJobDetails from "./MobileJobDetails";
import Image from "next/image";
import { Badge } from "./ui/badge";
import Apply from "./Apply";
import JobCard from "./JobCard";
import MyJobsCard from "./MyJobsCard";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/app/libs/axios";
import { UserContext } from "@/app/context/userContext";
import { job } from "@/types";
import FilterModal from "./filterModal";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

const Home = () => {
  const { data: session } = useSession();
  const { user, bookmarks } = useContext(UserContext) as any;
  const [selectedJob, setSelectedJob] = useState<
    (job & { createdBy: any }) | null
  >(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    isPending: loadingJobs,
    error: isError,
    data: jobs,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get(`/api/v1/jobs?filter=${search}`);
      return response.data.data;
    },
  });

  useEffect(() => {
    setSelectedJob(jobs?.[0]);
    if (search === "") {
      refetch();
    }
  }, [search]);

  const handleSearch = () => {
    setSearch(search);
    refetch();
  };

  const {
    isPending: loadingResume,
    error: resumeError,
    data: resumes,
  } = useQuery({
    queryKey: ["resumes", selectedJob?.id],
    queryFn: async () => {
      if (!selectedJob?.id) return null;
      const response = await api.get(`/api/v1/jobs/resume/${selectedJob?.id}`);
      console.log("Applied", response.data.data);
      return response.data.data.result;
    },
    enabled: !!selectedJob?.id,
  });

  const {
    isPending: loadingBookmarks,
    error: bookmarkError,
    data: jobBookmarks,
  } = useQuery({
    queryKey: ["jobbookmarks", selectedJob?.id],
    queryFn: async () => {
      if (!selectedJob?.id) return null;
      const response = await api.get(
        `/api/v1/bookmarks/job/${selectedJob?.id}`
      );
      return response.data.data;
    },
    enabled: !!selectedJob?.id,
  });

  const hasApplied = useMemo(() => {
    if (!resumes || !user?.id) return false;
    const resume = resumes?.map((resume: any) => resume?.user?.id);
    return resume?.includes(user?.id);
  }, [resumes, user?.id]);

  const isBookmarked = useMemo(() => {
    if (!jobBookmarks || !user?.id) return false;
    const bookmarked = jobBookmarks?.map((bookmark: any) => bookmark?.userId);
    console.log("Bookmarked users:", bookmarked);
    return bookmarked?.includes(user?.id);
  }, [jobBookmarks, user?.id]);

  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };

  if (loadingJobs) {
    return (
      <div className="h-[calc(100vh-73px)] flex flex-col mt-15">
        <div className="shrink-0 xl:px-[15%] px-5 pt-5">
          <div className="bg-linear-to-r from-blue-600 to-blue-400 h-auto rounded-2xl mb-6 lg:p-10 p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <h1 className="text-white text-2xl lg:text-3xl font-bold mb-2">
                Find your dream job with JobSmart 🚀
              </h1>
              <p className="text-blue-50 text-sm lg:text-base max-w-2xl">
                Use AI-powered matching to discover tech opportunities perfectly
                tailored to your skills.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 mt-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0 || !selectedJob) {
    return (
      <div className="h-[calc(100vh-73px)] flex flex-col mt-15">
        <div className="shrink-0 xl:px-[15%] px-5 pt-5">
          <div className="bg-linear-to-r from-blue-600 to-blue-400 h-auto rounded-2xl mb-6 lg:p-10 p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <h1 className="text-white text-2xl lg:text-3xl font-bold mb-2">
                Find your dream job with JobSmart 🚀
              </h1>
              <p className="text-blue-50 text-sm lg:text-base max-w-2xl">
                Use AI-powered matching to discover tech opportunities perfectly
                tailored to your skills.
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center mb-6">
            <div className="flex w-full items-center gap-2 border px-3 rounded-full py-2 border-gray-300 ">
              <Search className="text-gray-600" />
              <Input
                type="search"
                placeholder="Job title, keyword, company"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="h-10 outline-none border-0 focus-visible:ring-0 xl:text text-[13px]"
              />
              <Button
                type="submit"
                className="rounded-full"
                onClick={handleSearch}
              >
                Find Jobs
              </Button>
            </div>
            <Button>
              <SlidersHorizontal />
            </Button>
          </div>
          <div className="h-20 flex items-center justify-center">
            <p className="text-gray-500">No jobs found.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleBookmark = async () => {
    if (!selectedJob) {
      return null;
    }
    try {
      const response = await api.post("/api/v1/bookmarks", {
        authId: user.id,
        jobId: selectedJob?.id,
      });
      console.log(response.data.data);

      queryClient.invalidateQueries({
        queryKey: ["jobbookmarks", selectedJob?.id],
      });
    } catch (error) {
      console.log(error);
    }
  };

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

      <div className="h-[calc(100vh-73px)] flex flex-col mt-15">
        <div className="shrink-0 xl:px-[12%] px-5 pt-5">
          <div className="bg-linear-to-r from-blue-600 to-blue-400 h-auto rounded-2xl mb-6 lg:p-10 p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <h1 className="text-white text-2xl lg:text-3xl font-bold mb-2">
                Find your dream job with JobSmart 🚀
              </h1>
              <p className="text-blue-50 text-sm lg:text-base max-w-2xl">
                Use AI-powered matching to discover tech opportunities perfectly
                tailored to your skills.
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center mb-6">
            <div className="flex w-full items-center gap-2 border px-3 rounded-full py-2 border-gray-300 ">
              <Search className="text-gray-600" />
              <Input
                type="search"
                placeholder="Job title, keyword, company"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="h-10 outline-none border-0 focus-visible:ring-0 xl:text text-[13px]"
              />

              <Button
                type="submit"
                className="rounded-full"
                onClick={handleSearch}
              >
                Find Jobs
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <SlidersHorizontal />
                </Button>
              </DialogTrigger>
              <FilterModal />
            </Dialog>
          </div>
        </div>

        <div className="flex-1 xl:px-[12%] px-5 pb-5 min-h-0">
          <div className="flex gap-6 h-full">
            <div className="flex flex-col w-full lg:w-[45%] xl:w-[420px] min-h-0">
              <h1 className="lg:text-2xl text-[18px] font-bold mb-4 text-gray-800 shrink-0">
                Find Jobs
              </h1>

              <div
                className="flex-1 overflow-y-auto custom-scrollbar pr-2"
                style={scrollbarStyles as any}
              >
                <div className="space-y-4 pb-4">
                  {jobs?.map((job: any, index: number) => (
                    <div className="" key={index}>
                      <JobCard
                        job={job}
                        index={index}
                        selectedJob={selectedJob}
                        setSelectedJob={setSelectedJob}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Details */}
            {selectedJob && (
              <div className="hidden lg:flex flex-1 flex-col border rounded-xl bg-white shadow-sm min-h-0">
                <div
                  className="flex-1 overflow-y-auto custom-scrollbar"
                  style={scrollbarStyles as any}
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-3 mb-6">
                      <h1 className="font-bold text-3xl text-gray-800">
                        {selectedJob?.title}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium flex items-center gap-2 text-gray-600">
                          <Building2 className="h-4 w-4 text-orange-500" />{" "}
                          {selectedJob?.createdBy.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{selectedJob?.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">
                          {selectedJob?.salaryRange}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4 text-pink-400" />
                        <span className="">
                          {selectedJob?.Resume?.length}{" "}
                          {selectedJob?.Resume.length > 1
                            ? "applicants"
                            : "applicant"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-">
                          Posted{" "}
                          {formatDistance(
                            subDays(selectedJob.createdAt, 3),
                            new Date(),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex gap-3 mt-4">
                        {selectedJob.isClosed ? (
                          <Button className="flex-1 w-full" disabled>
                            This Job is closed
                          </Button>
                        ) : (
                          <div className="w-full">
                            {hasApplied ? (
                              <Button className="flex-1 w-full" disabled>
                                You have Applied
                              </Button>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="flex-1 w-full">
                                    Apply now
                                  </Button>
                                </DialogTrigger>
                                {selectedJob && <Apply job={selectedJob} />}
                              </Dialog>
                            )}
                          </div>
                        )}
                        {loadingBookmarks ? (
                          <Button className="bg-gray-300" disabled>
                            <Bookmark size={20} />
                          </Button>
                        ) : isBookmarked ? (
                          <Button className="bg-blue-500 hover:bg-blue-600">
                            <BookmarkCheck size={20} className="fill-current" />
                          </Button>
                        ) : (
                          <Button
                            className="bg-pink-400 hover:bg-pink-500"
                            onClick={handleBookmark}
                          >
                            <Bookmark size={20} />
                          </Button>
                        )}
                        <Button className="bg-amber-300 hover:bg-amber-400">
                          <Ban size={20} />
                        </Button>
                      </div>
                    </div>

                    <div className="border-t pt-6 mb-6">
                      <h2 className="font-bold text-2xl text-gray-800 mb-4">
                        Job description
                      </h2>
                      <p className="text-gray-600 text-[15px] leading-relaxed">
                        {selectedJob?.description}
                      </p>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          What you'll do:
                        </h3>

                        <ul className="space-y-2 text-gray-600 text-sm">
                          {selectedJob?.responsibilities.map(
                            (responsibility, idx) => (
                              <li key={idx}>• {responsibility}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Requirements:
                      </h3>

                      <ul className="space-y-2 text-gray-600 text-sm">
                        {selectedJob?.requirements.map((requirement, idx) => (
                          <li key={idx}>• {requirement}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-6 mb-6">
                      <h2 className="font-bold text-2xl text-gray-800 mb-4">
                        Required skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob?.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6 mb-6">
                      <h2 className="font-bold text-2xl text-gray-800 mb-4">
                        Benefits
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedJob.benefits?.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <span className="text-gray-600 text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center mt-8 pb-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="rounded-full px-8 py-4 text-sm shadow-lg hover:shadow-xl transition-shadow">
                            See how well you match this job 🔥
                          </Button>
                        </DialogTrigger>
                        {selectedJob && <Compatability job={selectedJob} />}
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
