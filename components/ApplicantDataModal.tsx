import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Sparkles, User, Star } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";
import { usePathname } from "next/navigation";

const ApplicantDataModal = ({ match, job }: { match: any; job: any }) => {
  const [progress, setProgress] = React.useState(13);
  const [filterResume, setFilterResume] = useState("ALL");
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const isApplicantPath = pathname?.includes("/applicants/");
  const isPath = pathname?.includes("/applicants/shortlisted");

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToShortlist = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/api/v1/jobs/shortlist/${match.id}`);
      setIsShortlisted(true);
    } catch (error) {
      console.error("Error adding to shortlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 items-start justify-start">
            <DialogTitle className="lg:text-2xl text-[16px] font-bold text-gray-900">
              {match?.user?.username}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Check this applicant data and his/her AI score
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <ScrollArea className="h-[65vh]">
        <div className="flex flex-col items-center mt-5 gap-3">
          <div className="w-30 h-30">
            <CircularProgressbar
              value={match?.matchPercentage}
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
              <ul className="">
                {match?.missingSkills.length > 0 ? (
                  <div className="grid grid-cols-2 space-y-2 ">
                    {match?.missingSkills.map((skills: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 w-full">
                        <div className="w-2 h-2 text-green-500 rounded-full mt-2">
                          *
                        </div>
                        <span className="text-gray-600 text-sm">{skills}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <p className="text-sm text-gray-600 text-center">
                      No missing skills!
                    </p>
                  </div>
                )}
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
      </ScrollArea>
      <div className="flex gap-2 mt-5">
        {isApplicantPath &&
          pathname !== "/dashboard/applicants/shortlisted" &&
          !isPath && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToShortlist}
              disabled={isShortlisted || isLoading}
            >
              <Star
                className={`h-4 w-4 mr-2 ${
                  isShortlisted ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
              {isShortlisted
                ? "Shortlisted"
                : isLoading
                ? "Adding..."
                : "Add to Shortlist"}
            </Button>
          )}
        <a
          href={match?.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full">View Resume</Button>
        </a>
      </div>
    </DialogContent>
  );
};

export default ApplicantDataModal;
