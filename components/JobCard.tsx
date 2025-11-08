"use client";
import React, { useContext, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Bookmark,
  BookmarkCheck,
  DollarSign,
  MapPin,
  Search,
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
import MyJobsCard from "./MyJobsCard";
import { UserContext } from "@/app/context/userContext";
import api from "@/app/libs/axios";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { job } from "@/types";

interface IJob {
  job: job
  index: number;
  selectedJob?: any;
  setSelectedJob?: any;
}

const JobCard = ({ job, index, selectedJob, setSelectedJob }: IJob) => {
  const { user, bookmarks } = useContext(UserContext) as any;
  const queryClient = useQueryClient();

  const {
    isPending: loadingBookmarks,
    error: bookmarkError,
    data: jobBookmarks,
  } = useQuery({
    queryKey: ["jobbookmarks", job?.id],
    queryFn: async () => {
      if (!job?.id) return null;
      const response = await api.get(`/api/v1/bookmarks/job/${job?.id}`);
      console.log("jobBookmarks", response.data.data);
      return response.data.data;
    },
    enabled: !!job?.id,
  });

  const isBookmarked = useMemo(() => {
    if (!jobBookmarks || !user?.id) return false;
    const bookmarked = jobBookmarks?.map((bookmark: any) => bookmark?.userId);
    return bookmarked?.includes(user.id);
  }, [jobBookmarks, user?.id]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!job.id) {
      return null;
    }
    try {
      const response = await api.post("/api/v1/bookmarks", {
        authId: user.id,
        jobId: job?.id,
      });
      console.log(response.data.data);

      queryClient.invalidateQueries({
        queryKey: ["jobbookmarks", job?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobbookmarks"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      key={index}
      className={`border hover:shadow-lg transition-all duration-200 w-full rounded-2xl cursor-pointer ${
        selectedJob.title === job.title
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-300 bg-[#f9f9fb]"
      }`}
      onClick={() => setSelectedJob(job)}
    >
      <CardHeader className="flex flex-row justify-between items-start pb-3">
        <div className="flex flex-row gap-2 items-center">
          <>
            <img
              src="https://logo.clearbit.com/flutterwave.com"
              width={100}
              height={100}
              className="w-12 h-12 rounded-xl"
              alt=""
            />
          </>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {job.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              <Badge
                className={`${
                  job.jobType === "Fulltime" &&
                  "bg-green-100 text-green-700 border-green-200"
                } ${
                  job.jobType === "Contract" &&
                  "bg-amber-100 text-amber-700 border-amber-200"
                }  ${
                  job.jobType === "Part-time" &&
                  "bg-blue-100 text-blue-700 border-blue-200"
                }  ${
                  job.jobType === "Internship" &&
                  "bg-purple-100 text-purple-700 border-purple-200"
                }  ${
                  job.jobType === "Freelance" &&
                  "bg-pink-100 text-pink-700 border-pink-200"
                } ${
                  job.jobType === "Temporary" &&
                  "bg-red-100 text-red-700 border-red-200"
                } `}
              >
                {" "}
                {job.jobType}
              </Badge>
            </CardDescription>
          </div>
        </div>

        {loadingBookmarks ? (
          <button className="text-gray-400 p-2 rounded-lg" disabled>
            <Bookmark className="h-5 w-5" />
          </button>
        ) : isBookmarked ? (
          <button
            className="transition-all p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"
            onClick={handleBookmark}
          >
            <BookmarkCheck className="h-5 w-5 fill-current" />
          </button>
        ) : (
          <button
            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded-lg"
            onClick={handleBookmark}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        )}
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-gray-600 pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span>{job.salaryRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-500" />
          <span>{job.location}</span>
        </div>
        <p className="text-gray-500 line-clamp-2">{job.description}</p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className="w-full text-white rounded-xl xl:block lg:block hidden">
          View More Details
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full text-white rounded-xl xl:hidden lg:hidden">
              View More Details
            </Button>
          </DrawerTrigger>
          <MobileJobDetails job={job} />
        </Drawer>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
