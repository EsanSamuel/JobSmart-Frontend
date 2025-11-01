"use client";
import api from "@/app/libs/axios";
import { data } from "@/app/libs/dummyData";
import { AppSidebar } from "@/components/app-sidebar";
import CompanyJobsCard from "@/components/CompanyJobs";
import DashboardNav from "@/components/dashboardNav";
import MyJobsCard from "@/components/MyJobsCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CheckCircle, Clock, Users } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };

  const {
    isPending,
    error,
    data: jobs,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/jobs/company/${session?.user.id}`
      );
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

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
      <SidebarInset className="bg-white ">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <DashboardNav />
        </header>
        <div className="flex flex-1 flex-col gap-4 lg:p-10 p-5 pt-5 w-full">
          <div>
            <h1 className="text-3xl font-bold text-blue-500">Overview</h1>
            <p className="text-gray-700">Here's the overview</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-300 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
              <p className="text-sm text-gray-600 font-medium">Jobs Listed</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-300 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">102</p>
              <p className="text-sm text-gray-600 font-medium">Applicants</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-300 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">32</p>
              <p className="text-sm text-gray-600 font-medium">
                Interview schedule
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-300 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
              <p className="text-sm text-gray-600 font-medium">Accepted</p>
            </div>
          </div>
          <div className="flex flex-col w-full  lg:p-10 p-5 min-h-0 ">
            <div className="pb-5">
              <h1 className="text-2xl font-bold">Jobs listed</h1>
            </div>
            <div
              className="flex-1 overflow-y-auto custom-scrollbar pr-2"
              style={scrollbarStyles as any}
            >
              <div className="space-y-4 overflow-y-auto">
                {jobs?.map((job: any, index: number) => {
                  const matchScore = 75 + Math.floor(Math.random() * 20);

                  return (
                    <CompanyJobsCard
                      job={job}
                      index={index}
                      matchScore={matchScore}
                      //setSelectedJob={setSelectedJob}
                    />
                  );
                })}
                <div className="flex items-center justify-center w-full mt-5">
                  <Button
                    className=" w-full rounded-full border-gray-300"
                    variant="outline"
                  >
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
