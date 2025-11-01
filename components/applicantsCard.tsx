"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  FileText,
  Mail,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { applicants, data } from "@/app/libs/dummyData";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";
import { Dialog, DialogTrigger } from "./ui/dialog";
import ApplicantDataModal from "./ApplicantDataModal";

interface Ijobs {
  job: any;
  index?: number;
}

export default function ApplicantsCard({ job, index }: Ijobs) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const {
    isPending,
    error,
    data: jobs,
  } = useQuery({
    queryKey: ["jobs", session?.user.id],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/jobs/company/${session?.user.id}`
      );
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

  const applicantsMinusFirst = job?.Resume.slice(1, 3);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-gray-300  rounded-xl shadow-sm"
    >
      <div className="bg-white rounded-xl -sm hover:shadow-md transition-all overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-linear-to-r from-blue-50 to-white">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">
                {job.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                >
                  {job?.Resume?.length}{" "}
                  {job?.Resume?.length === 1 ? "Applicant" : "Applicants"}
                </Badge>
              </div>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 hover:bg-blue-100 transition-colors"
            >
              <ChevronsUpDown
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
              <span className="sr-only">Toggle applicants</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        {job?.Resume[0] && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={job?.Resume[0]?.user?.profileImage}
                    alt={job.Resume[0]?.user?.username}
                  />
                  <AvatarFallback className="rounded-full">CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {job.Resume[0]?.user?.username}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-sm text-gray-600 truncate xl:w-70 w-30">
                      {job.Resume[0]?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="lg:block md:block hidden">View</span>
                  </Button>
                </DialogTrigger>
                <ApplicantDataModal match={job.Resume[0]} job={job} />
              </Dialog>
            </div>
          </div>
        )}
      </div>

      <CollapsibleContent className="space-y-3 mt-3">
        {applicantsMinusFirst?.map((applicant: any, idx: number) => (
          <div
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            key={idx}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={applicant?.user?.profileImage}
                      alt={applicant?.user?.username}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {applicant?.user?.username}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-sm text-gray-600 truncate">
                        {applicant?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="lg:block md:block hidden">View</span>
                    </Button>
                  </DialogTrigger>
                  <ApplicantDataModal match={applicant} job={job} />
                </Dialog>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center w-full mt-5 p-5">
          <Button
            className=" w-full rounded-full border-gray-300"
            variant="outline"
            onClick={() => router.push(`/dashboard/applicants/${job.id}`)}
          >
            View All
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Helper function for gradient colors
function getGradientColors(index: number): string {
  const gradients = [
    "#667eea, #764ba2",
    "#f093fb, #f5576c",
    "#4facfe, #00f2fe",
    "#43e97b, #38f9d7",
    "#fa709a, #fee140",
    "#30cfd0, #330867",
    "#a8edea, #fed6e3",
    "#ff9a56, #ff6a88",
  ];
  return gradients[index % gradients.length];
}
