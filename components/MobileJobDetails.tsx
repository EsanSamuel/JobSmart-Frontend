import React, { useContext, useMemo } from "react";
import {
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import Compatability from "./check-compatability";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import Apply from "./Apply";
import { UserContext } from "@/app/context/userContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { job } from "@/types";
import { formatDistance } from "date-fns";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { responseList } from "@/lib/response";

interface IMobileJobDetails {
  job: job;
  recommendationPage?: boolean;
}

const MobileJobDetails = ({ job, recommendationPage }: IMobileJobDetails) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext) as any;
  const {
    data: resumes,
  } = useQuery({
    queryKey: ["resumes", job?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/jobs/resume/${job?.id}`);
      return responseList(response);
    },
    enabled: !!job?.id,
  });

  const {
    isPending: loadingBookmarks,
    data: jobBookmarks,
  } = useQuery({
    queryKey: ["jobbookmarks", job?.id],
    queryFn: async () => {
      if (!job?.id) return null;
      const response = await api.get(`/api/v1/bookmarks/job/${job.id}`);
      return response.data.data;
    },
    enabled: !!job?.id,
  });

  const hasApplied = useMemo(() => {
    const resume = resumes?.map((resume: any) => resume?.user?.id);
    return resume?.includes(user?.id);
  }, [resumes, user?.id]);

  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };
  const handleBookmark = async () => {
    if (!job?.id) {
      return null;
    }
    try {
      if (!user?.id) {
        toast.error("Sign in to save jobs to your list.");
        return;
      }
      const existingBookmark = jobBookmarks?.find(
        (bookmark: any) => bookmark?.userId === user.id
      );
      if (existingBookmark?.id) {
        await api.post(`/api/v1/bookmarks/${existingBookmark.id}`);
        toast.success("Job removed from your saved list.");
      } else {
        await api.post("/api/v1/bookmarks", {
          authId: user.id,
          jobId: job.id,
        });
        toast.success("Job saved to your list.");
      }
      await queryClient.invalidateQueries({ queryKey: ["jobbookmarks", job.id] });
      await queryClient.invalidateQueries({ queryKey: ["bookmark", user.id] });
    } catch (error) {
      toast.error("Couldn’t save this job. Please try again.");
    }
  };

  const isBookmarked = useMemo(() => {
    if (!jobBookmarks || !user?.id) return false;
    const bookmarked = jobBookmarks?.map((bookmark: any) => bookmark?.userId);
    return bookmarked?.includes(user?.id);
  }, [jobBookmarks, user?.id]);

  return (
    <DrawerContent
      className={`${
        recommendationPage ? "xl:block lg:block" : "xl:hidden lg:hidden"
      } max-h-[92dvh] overflow-hidden border-slate-200 bg-white lg:px-[25%]`}
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
        className="h-auto max-h-[calc(92dvh-2.5rem)] overflow-y-auto custom-scrollbar"
        style={scrollbarStyles as any}
      >
        <div className="mx-auto max-w-3xl p-5 sm:p-7">
          <div className="mb-7 border-b border-slate-200 pb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
              {job?.jobType} opportunity
            </p>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
              {job?.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                {job?.createdBy?.username}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                {job?.location || "Location not listed"}
              </span>
              <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                <DollarSign className="h-4 w-4 text-slate-400" />
                {job.salaryRange || "Salary not listed"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                {job?.Resume?.length ?? 0} applicants
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Posted{" "}
                {formatDistance(new Date(job?.createdAt), new Date(), { addSuffix: true })}
              </span>
            </div>

            <div className="mt-5 flex gap-3">
              {job?.isClosed ? (
                <Button className="h-11 flex-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-200" disabled>
                  This job is closed
                </Button>
              ) : (
                <div className="w-full">
                  {hasApplied ? (
                  <Button className="h-11 flex-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-50" disabled>
                      You have Applied
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="h-11 flex-1 rounded-lg">Apply now</Button>
                      </DialogTrigger>
                      <Apply job={job} />
                    </Dialog>
                  )}
                </div>
              )}

              {isBookmarked ? (
                <Button variant="outline" className="h-11 w-12 shrink-0 rounded-lg border-blue-200 text-blue-700" aria-label="Remove saved job" onClick={handleBookmark}>
                  <BookmarkCheck size={20} className="fill-current" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-11 w-12 shrink-0 rounded-lg border-slate-300 text-slate-600 hover:text-blue-700"
                  aria-label="Save job"
                  onClick={handleBookmark}
                >
                  <Bookmark size={20} />
                </Button>
              )}

            </div>
          </div>

          <div className="mb-7">
            <h2 className="mb-3 text-lg font-semibold text-slate-950">
              Job description
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              {job.description}
            </p>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                What you'll do:
              </h3>

              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                {job.responsibilities.map((responsibility: any, index: number) => (
                  <li key={`${index}-${responsibility}`} className="flex gap-3"><span className="text-blue-600">•</span><span>{responsibility}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-7">
            <h3 className="mb-3 text-lg font-semibold text-slate-950">Requirements:</h3>

            <ul className="space-y-2 text-sm leading-6 text-slate-600">
              {job.requirements.map((requirement: any, index: number) => (
                <li key={`${index}-${requirement}`} className="flex gap-3"><span className="text-blue-600">•</span><span>{requirement}</span></li>
              ))}
            </ul>
          </div>

          <div className="mb-7">
            <h2 className="mb-3 text-lg font-semibold text-slate-950">
              Required skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: any) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-7">
            <h2 className="mb-3 text-lg font-semibold text-slate-950">Benefits</h2>
            <div className="grid grid-cols-2 gap-3">
              {job.benefits?.map((benefit: any, index: number) => (
                <div key={`${index}-${benefit}`} className="flex items-start gap-2">
                  <div className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
                  <span className="text-gray-600 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 pb-8">
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" className="rounded-lg border-slate-300 px-5">
                  Check your match
                </Button>
              </DialogTrigger>
              <Compatability job={job} />
            </Dialog>
          </div>
        </div>
      </div>
    </DrawerContent>
  );
};

export default MobileJobDetails;
