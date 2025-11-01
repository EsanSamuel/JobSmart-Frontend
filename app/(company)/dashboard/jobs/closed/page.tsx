"use client";
import { data } from "@/app/libs/dummyData";
import CompanyJobsCard from "@/components/CompanyJobs";
import DashboardNav from "@/components/dashboardNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset } from "@/components/ui/sidebar";
import { CheckCircle, Search } from "lucide-react";
import React from "react";

const Page = () => {
  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
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
      <SidebarInset className="bg-white h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <DashboardNav />
        </header>
        <div className="flex flex-col w-full  lg:p-10 p-5 min-h-0 ">
          <div className="pb-5 ">
            <h1 className="text-2xl font-bold mb-5">Closed Jobs</h1>
            <div className="flex w-full items-center gap-2 border px-3 rounded-full py-2 border-gray-300 mb-6 ">
              <Search className="text-gray-600" />
              <Input
                type="search"
                placeholder="Job title, keyword, company"
                className="h-10 outline-none border-0 focus-visible:ring-0 xl:text text-[13px]"
              />
              <Button type="submit" className="rounded-full">
                Find Jobs
              </Button>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto custom-scrollbar pr-2"
            style={scrollbarStyles as any}
          >
            <div className="space-y-4 overflow-y-auto">
              {data.map((job, index) => {
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default Page;
