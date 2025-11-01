"use client";
import DashboardNav from "@/components/dashboardNav";
import { Input } from "@/components/ui/input";
import { SidebarInset } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { FormEvent, useContext, useState } from "react";
import {
  Briefcase,
  FileText,
  CheckCircle,
  Clipboard,
  LocateIcon,
  MapPin,
  Users,
  Banknote,
  ThumbsUp,
  BowArrow,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/app/libs/axios";
import { UserContext } from "@/app/context/userContext";

const Page = () => {
  const { user } = useContext(UserContext) as any;
  const [job, setJobs] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    skills: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    maxApplicants: 0,
    jobType: "",
  });

  const handleCreateJob = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const skills = job.skills.split(" , ").map((skill) => skill.trim());
      const requirements = job.requirements
        .split(" , ")
        .map((requirement) => requirement.trim());
      const responsibilities = job.responsibilities
        .split(" , ")
        .map((responsibility) => responsibility.trim());
      const benefits = job.benefits
        .split(" , ")
        .map((benefit) => benefit.trim());
      console.log(job, skills, requirements, responsibilities, benefits);

      const response = await api.post("/api/v1/jobs", {
        title: job.title,
        description: job.description,
        salaryRange: job.salary,
        location: job.location,
        skills,
        requirements,
        responsibilities,
        benefits,
        maxApplicants: job.maxApplicants,
        authId: user.id,
        jobType: job.jobType,
      });
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SidebarInset className="bg-linear-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white border-b border-gray-200">
        <DashboardNav />
      </header>

      <div className="lg:px-10 p-5 lg:py-5">
        <div className=" lg:px-6 lg:py-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
          </div>
          <p className="text-gray-600 ">
            Create a compelling job listing to attract top talent
          </p>
        </div>

        <div className=" lg:px-6 pb-10 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:p-6  py-6 transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-2.5 rounded-lg mt-1">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Job Title
                  </h2>
                  <p className="text-sm text-gray-600">
                    Enter a clear, descriptive job title
                  </p>
                </div>
                <Input
                  placeholder="e.g., Senior Frontend Developer"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setJobs({ ...job, title: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-2.5 rounded-lg mt-1">
                <Clipboard className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Job Description
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provide an overview of the role and your company
                  </p>
                </div>
                <Textarea
                  placeholder="Describe the role, company culture, and what makes this opportunity unique..."
                  className="border-gray-300 focus:ring-2 focus:ring-green-500 min-h-[120px] resize-none"
                  onChange={(e) =>
                    setJobs({ ...job, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-2.5 rounded-lg mt-1">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Job Location
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provide the location of your company
                  </p>
                </div>
                <Input
                  placeholder="e.g., Lagos, Nigeria"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setJobs({ ...job, location: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-2.5 rounded-lg mt-1">
                <Banknote className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Job Salary Range
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provide the salary range for this job
                  </p>
                </div>
                <Input
                  placeholder="e.g., $4000 - 5000"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setJobs({ ...job, salary: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-2.5 rounded-lg mt-1">
                <LocateIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Job Type
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provide the type of this job
                  </p>
                </div>
                <Select
                  value={job.jobType}
                  onValueChange={(value) => setJobs({ ...job, jobType: value })}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-blue-500 w-full">
                    <SelectValue placeholder="FullTime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FullTime">FullTime</SelectItem>
                    <SelectItem value="PartTime">PartTime</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">FreeLance</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-2.5 rounded-lg mt-1">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Requirements
                  </h2>
                  <p className="text-sm text-gray-600">
                    List the qualifications and skills needed (Separate with
                    comma)
                  </p>
                </div>
                <Textarea
                  placeholder="e.g., 3+ years React experience, TypeScript proficiency, Bachelor's degree..."
                  className="border-gray-300 focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
                  onChange={(e) =>
                    setJobs({ ...job, requirements: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-orange-50 p-2.5 rounded-lg mt-1">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    What You'll Do
                  </h2>
                  <p className="text-sm text-gray-600">
                    Outline the key responsibilities and day-to-day tasks
                    (Separate with comma)
                  </p>
                </div>
                <Textarea
                  placeholder="e.g., Build responsive UI components, Collaborate with designers, Lead code reviews..."
                  className="border-gray-300 focus:ring-2 focus:ring-orange-500 min-h-[100px] resize-none"
                  onChange={(e) =>
                    setJobs({ ...job, responsibilities: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-2.5 rounded-lg mt-1">
                <ThumbsUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Benefits
                  </h2>
                  <p className="text-sm text-gray-600">
                    List the benefits of this job (Separate with comma)
                  </p>
                </div>
                <Textarea
                  placeholder="e.g., Flexible work hours Health benefits Annual bonus"
                  className="border-gray-300 focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
                  onChange={(e) =>
                    setJobs({ ...job, benefits: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-2.5 rounded-lg mt-1">
                <BowArrow className="w-5 h-5 text-lime-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Skills
                  </h2>
                  <p className="text-sm text-gray-600">
                    List the skills needed of this job (Separate with comma)
                  </p>
                </div>
                <Textarea
                  placeholder="e.g., Node js, TypeScript, React"
                  className="border-gray-300 focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
                  onChange={(e) => setJobs({ ...job, skills: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200  lg:p-6  py-6  transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-2.5 rounded-lg mt-1">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Job Max Applicatants
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provide the lmaximum number of applicants you want
                  </p>
                </div>
                <Input
                  placeholder="e.g., 50 , 100, 150"
                  type="number"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setJobs({ ...job, maxApplicants: e.target.valueAsNumber })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              variant="outline"
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Save Draft
            </Button>
            <Button
              className="px-6 bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateJob}
            >
              Post Job
            </Button>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Page;
