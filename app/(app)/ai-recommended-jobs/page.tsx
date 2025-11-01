"use client";
import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ban, Bookmark, DollarSign, MapPin, Search, Users } from "lucide-react";
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
import { UserContext } from "@/app/context/userContext";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import UploadResume from "@/components/uploadResume";
import { job } from "@/types";

const Page = () => {
  const { AIRecommendedJobs, user } = useContext(UserContext) as any;
  //const [selectedJob, setSelectedJob] = useState(AIRecommendedJobs[0]);

  if (!user?.Resume[0]) {
    return (
      <div>
        <Navbar />
        <div className="h-[calc(100vh-73px)] flex flex-col space-y-3 items-center justify-center">
          <p className="text-gray-500">
            Upload your resume to let AI recommend jobs for you!
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Upload CV</Button>
            </DialogTrigger>
            <UploadResume />
          </Dialog>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="lg:px-[30%] px-5 py-10">
        <div className="mt-15">
          <h1 className=" font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent text-3xl sm:text-4xl  mb-2">
            Top AI Recommended jobs for you ✨
          </h1>
          <p className="text-[14px] text-gray-700 mt-2">
            View top recommended job sorted by AI for you.
          </p>

          <div className="space-y-4 pb-4 mt-10">
            {AIRecommendedJobs?.map((job: job, index: number) => (
              <div className="flex gap-4">
                <h1 className="xl:text-2xl text-[14px] font-semibold text-gray-700">
                  {index + 1}.
                </h1>
                <Card
                  key={index}
                  className={`border hover:shadow-lg transition-all duration-200 w-full rounded-2xl cursor-pointer `}
                >
                  <CardHeader className="flex flex-row justify-between items-start pb-3">
                    <div className="flex flex-row gap-2 items-center">
                      <>
                        <img
                          src=""
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
                        <CardDescription className="text-sm text-gray-500 flex gap-3">
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
                          <Badge className="bg-green-100 text-green-500 border-green-200">
                            Suggested by 77%
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>

                    <button
                      className="text-gray-600 hover:text-blue-600 transition-colors ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
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
                    <p className="text-gray-500 line-clamp-2">
                      {job.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Drawer>
                      <DrawerTrigger className=" w-full">
                        <Button className="w-full text-white rounded-xl">
                          View More Details
                        </Button>
                      </DrawerTrigger>
                      <MobileJobDetails job={job} recommendationPage />
                    </Drawer>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
