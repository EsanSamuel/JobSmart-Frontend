import React, { useContext, useMemo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import Compatability from "./check-compatability";
import {
  Ban,
  Bookmark,
  CircleX,
  ClosedCaption,
  DollarSign,
  MapPin,
  Pen,
  Pencil,
  Users,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import Apply from "./Apply";
import api from "@/app/libs/axios";
import { UserContext } from "@/app/context/userContext";
import { useQuery } from "@tanstack/react-query";
import { job } from "@/types";

interface IMobileJobDetails {
  job: job;
  recommendationPage?: boolean;
}

const CompanyJobDetails = ({ job, recommendationPage }: IMobileJobDetails) => {
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
    const resume = resumes?.map((resume: any) => resume.user.id);
    return resume?.includes(user.id);
  }, [resumes]);
  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };
  const handleBookmark = async () => {
    if (!job.id) {
      return null;
    }
    try {
      const response = await api.post("/api/v1/bookmarks", {
        authId: user.id,
        jobId: job?.id,
      });
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeJob = async () => {
    try {
      const response = await api.patch(`/api/v1/jobs/close/${job.id}`);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DrawerContent
      className={`${
        recommendationPage ? "xl:block lg:block" : "xl:hidden lg:hidden"
      } lg:px-[25%]`}
    >
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

      <div
        className="flex-1 h-auto xl:h-[95vh] overflow-y-auto custom-scrollbar"
        style={scrollbarStyles as any}
      >
        <div className="p-6">
          <div className="flex flex-col gap-3 mb-6">
            <h1 className="font-bold text-2xl text-gray-800">{job.title}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold">{job.salaryRange}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 text-pink-400" />
              <span className="">{job?.Resume?.length} applicants</span>
            </div>

            <div className="flex gap-3 mt-4">
              {job?.isClosed ? (
                <Button className="flex-1 w-full" disabled>
                  You have closed this job
                </Button>
              ) : (
                <Button
                  className="flex-1 w-full"
                  title="Close job"
                  onClick={closeJob}
                >
                  Close job
                </Button>
              )}
              <Button
                className="bg-pink-400 hover:bg-pink-500"
                title="Edit"
                onClick={handleBookmark}
              >
                <Pencil size={20} />
              </Button>
              <Button
                className="bg-amber-300 hover:bg-amber-400"
                title="Archieve"
              >
                <CircleX size={20} />
              </Button>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h2 className="font-bold text-2xl text-gray-800 mb-4">
              Job description
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              {job.description}
            </p>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                What you'll do:
              </h3>

              <ul className="space-y-2 text-gray-600 text-sm">
                {job.responsibilities.map((responsibility: any) => (
                  <li>• {responsibility}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-2">Requirements:</h3>

            <ul className="space-y-2 text-gray-600 text-sm">
              {job.requirements.map((requirement: any) => (
                <li>• {requirement}</li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6 mb-6">
            <h2 className="font-bold text-2xl text-gray-800 mb-4">
              Required skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: any) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h2 className="font-bold text-2xl text-gray-800 mb-4">Benefits</h2>
            <div className="grid grid-cols-2 gap-3">
              {job.benefits?.map((benefit: any) => (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-gray-600 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DrawerContent>
  );
};

export default CompanyJobDetails;
