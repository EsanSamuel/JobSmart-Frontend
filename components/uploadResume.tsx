"use client";
import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Sparkles,
  User,
  CheckCircle2,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import api from "@/app/libs/axios";
import { UserContext } from "@/app/context/userContext";
import axios from "axios";

interface IJob {
  job: {
    title: string;
    maxApplicants: number;
    description: string;
    skills: string[];
    location: string | null;
    jobType: string;
    salaryRange: string | null;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
    company: string | null;
    isArchived: boolean;
    embedding: number[];
    createdById: string;
  };
}

const UploadResume = () => {
  const { user } = useContext(UserContext) as any;
  const [file, setFile] = useState<File | null>();

  const submitResume = async () => {
    const formData = new FormData();
    formData.append("authId", user.id);

    if (file) {
      formData.append("CV", file);
    }

    const response = await axios.post(
      "http://localhost:5000/api/v1/users/resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data.data);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <SendHorizontal className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 items-start justify-start">
            <DialogTitle className="lg:text-2xl text-[16px] font-bold text-gray-900">
              Upload CV
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              Upload your CV to get better user experience.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Upload className="h-4 w-4" />
            <span>Upload Resume</span>
          </div>

          <div className="relative">
            <label
              htmlFor="pdf"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-12 h-12 mb-3 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <p className="mb-2 text-sm text-gray-600 font-medium">
                  <span className="text-blue-600">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX (MAX. 10MB)
                </p>
                {file && (
                  <div className="mt-3 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      {file.name}
                    </span>
                  </div>
                )}
              </div>
              <Input
                id="pdf"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <Button
            onClick={submitResume}
            className="w-full h-11 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            disabled={!file}
          >
            <SendHorizontal className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>


      </div>
    </DialogContent>
  );
};

export default UploadResume;
