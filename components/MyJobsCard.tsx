"use client";
import React, { useContext, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Users,
  Briefcase,
  Clock,
  Filter,
  Trash2,
  ExternalLink,
  TrendingUp,
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
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import Navbar from "@/components/Navbar";
import MobileJobDetails from "@/components/MobileJobDetails";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";
import { UserContext } from "@/app/context/userContext";
import { job } from "@/types";

interface Ijobs {
  job: job & { createdBy: any };
  index: number;
  matchScore: number;
  setSelectedJob?: any;
}

const MyJobsCard = ({ job, index, matchScore, setSelectedJob }: Ijobs) => {
  const { user } = useContext(UserContext) as any;
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
    const resume = resumes?.map((resume: any) => resume?.user?.id);
    return resume?.includes(user?.id);
  }, [resumes]);
  return (
    <Card
      key={index}
      className="border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 w-full rounded-2xl 
      cursor-pointer bg-white overflow-hidden group"
      onClick={() => setSelectedJob(job)}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4 flex-1 min-w-0">
            <img
              src="https://logo.clearbit.com/flutterwave.com"
              width={100}
              height={100}
              className="w-12 h-12 rounded-xl"
              alt=""
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
                  {job?.title}
                </CardTitle>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                <span className="font-semibold text-gray-900 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                 { job?.createdBy?.username}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                  <span>{job.jobType}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {job?.salaryRange}
                </Badge>
                {matchScore && (
                  <Badge
                    className={`${
                      matchScore >= 85
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    } hover:bg-opacity-100`}
                  >
                    {matchScore}% Match
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {job.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>Saved on Tuesday, Oct 28, 2025</span>
              </div>
            </div>
          </div>

          <button className="transition-all p-2 rounded-lg text-blue-600 bg-blue-50">
            <BookmarkCheck className="h-5 w-5 fill-current" />
          </button>
        </div>
      </CardHeader>

      <Separator />

      <CardFooter className="pt-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {hasApplied ? (
            <Button
              size="sm"
              className="rounded-full gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              You've Applied
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-full gap-2 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => e.stopPropagation()}
            >
              Apply Now
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-full">
                View Details
              </Button>
            </DrawerTrigger>
            <MobileJobDetails job={job} recommendationPage />
          </Drawer>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MyJobsCard;
