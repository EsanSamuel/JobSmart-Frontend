"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { data } from "../../../app/libs/dummyData";
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
import MyJobsCard from "@/components/MyJobsCard";
import { UserContext } from "@/app/context/userContext";

const Page = () => {
  const { bookmarks, appliedJobs, matchedJobs } = useContext(
    UserContext
  ) as any;
  const [selectedJob, setSelectedJob] = useState(data[0]);
  const [selected, setSelected] = useState("BOOKMARK");
  const [percentage, setPercentage] = useState(0);

  const switchMode = () => {
    if (selected === "BOOKMARK") {
      return bookmarks;
    } else if (selected === "APPLIEDJOBS") {
      return appliedJobs;
    } else if (selected === "MATCHEDJOBS") {
      return matchedJobs;
    }
  };

  useEffect(() => {
    const TotalMatchedPercentage = () => {
      if (!matchedJobs || matchedJobs.length === 0) return;
      let totalPercentage = 0;
      for (const matchedJob of matchedJobs) {
        totalPercentage += matchedJob?.matchPercentage / matchedJobs.length;
        setPercentage(totalPercentage);
      }
    };
    TotalMatchedPercentage();
  }, [matchedJobs]);

  useEffect(() => {
    console.log(bookmarks);
  }, [bookmarks]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />
      <div className="lg:px-[20%] xl:px-[25%] px-5 py-8">
        <div className="mb-8 mt-15">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold mb-2">
                {selected === "BOOKMARK" && "My Saved Jobs"}
                {selected === "APPLIEDJOBS" && "Applied Jobs"}
                {selected === "MATCHEDJOBS" && "AI Matched Jobs"}
              </h1>
              <p className="text-gray-600">
                {switchMode()?.length}{" "}
                {switchMode()?.length === 1 ? "job" : "jobs"} waiting for you
              </p>
            </div>
            <Button variant="outline" className="gap-2 sm:w-auto w-full">
              <Filter className="h-4 w-4" />
              Filter Jobs
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved jobs..."
                className="pl-10 h-11"
              />
            </div>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-full sm:w-[180px] h-11">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div
              className={`bg-white rounded-xl p-4 border  shadow-sm hover:shadow-md transition-shadow ${
                selected === "BOOKMARK" ? "border-blue-400" : "border-gray-200"
              }`}
              onClick={() => setSelected("BOOKMARK")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {bookmarks?.length}
              </p>
              <p className="text-xs text-gray-600 font-medium">Saved Jobs</p>
            </div>

            <div
              className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                selected === "APPLIEDJOBS"
                  ? "border-blue-300"
                  : " border-gray-200"
              }`}
              onClick={() => setSelected("APPLIEDJOBS")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {appliedJobs?.length}
              </p>
              <p className="text-xs text-gray-600 font-medium">Applied</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-600 font-medium">Interviews</p>
            </div>

            <div
              className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                selected === "MATCHEDJOBS"
                  ? "border-blue-300"
                  : " border-gray-200"
              }`}
              onClick={() => setSelected("MATCHEDJOBS")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(percentage)}%
              </p>
              <p className="text-xs text-gray-600 font-medium">Avg Match</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {switchMode()?.map((item: any, index: number) => {
            const matchScore = 75 + Math.floor(Math.random() * 20);

            return (
              <div className="" key={index}>
                <MyJobsCard
                  job={item.job}
                  index={index}
                  matchScore={item.matchPercentage}
                  setSelectedJob={setSelectedJob}
                />
              </div>
            );
          })}
        </div>

        {data.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start saving jobs you're interested in to view them here. You can
              bookmark any job to review later.
            </p>
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
