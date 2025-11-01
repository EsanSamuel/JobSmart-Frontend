import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Sparkles, User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";

const ApplicantDataModal = ({ match, job }: { match: any; job: any }) => {
  const [progress, setProgress] = React.useState(13);
  const [filterResume, setFilterResume] = useState("ALL");
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

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
               {match.missingSkills.length > 0 ? (
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
               ):(
                <div className="w-full flex justify-center items-center">
                    <p className="text-sm text-gray-600 text-center">No missing skills!</p>
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
      <a href={match.fileUrl} target="_blank" rel="noopener noreferrer">
        <Button className="w-full mt-5">View Resume</Button>
      </a>
    </DialogContent>
  );
};

export default ApplicantDataModal;
