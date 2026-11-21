"use client";

import { useContext, useMemo } from "react";
import { Bookmark, BookmarkCheck, DollarSign, MapPin } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserContext } from "@/app/context/userContext";
import { job } from "@/types";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import MobileJobDetails from "@/components/MobileJobDetails";

interface IJob {
  job: job;
  index: number;
  selectedJob?: job | null;
  setSelectedJob?: (job: job) => void;
}

const JobCard = ({ job, selectedJob, setSelectedJob }: IJob) => {
  const { user } = useContext(UserContext) as any;
  const queryClient = useQueryClient();
  const api = useApi();

  const { isPending: loadingBookmarks, data: jobBookmarks } = useQuery({
    queryKey: ["jobbookmarks", job.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/bookmarks/job/${job.id}`);
      return response.data.data;
    },
    enabled: !!job.id,
  });

  const isBookmarked = useMemo(() => {
    if (!jobBookmarks || !user?.id) return false;
    return jobBookmarks.some((bookmark: any) => bookmark?.userId === user.id);
  }, [jobBookmarks, user?.id]);

  const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!user?.id) {
      toast.error("Sign in to save jobs to your list.");
      return;
    }

    try {
      const existingBookmark = jobBookmarks?.find(
        (bookmark: any) => bookmark?.userId === user.id
      );
      if (existingBookmark?.id) {
        await api.post(`/api/v1/bookmarks/${existingBookmark.id}`);
        toast.success("Job removed from your saved list.");
      } else {
        await api.post("/api/v1/bookmarks", { authId: user.id, jobId: job.id });
        toast.success("Job saved to your list.");
      }
      await queryClient.invalidateQueries({ queryKey: ["jobbookmarks", job.id] });
      await queryClient.invalidateQueries({ queryKey: ["bookmark", user.id] });
    } catch {
      toast.error("Couldn’t update your saved jobs. Please try again.");
    }
  };

  return (
    <Card
      aria-current={selectedJob?.id === job.id ? "true" : undefined}
      className={`w-full cursor-pointer gap-0 rounded-xl border bg-white py-0 transition-colors duration-150 ${
        selectedJob?.id === job.id
          ? "border-blue-500 ring-1 ring-blue-500/15"
          : "border-slate-200 hover:border-slate-300"
      }`}
      onClick={() => setSelectedJob?.(job)}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src={job.createdBy?.profileImage || "/flutterwave.png"}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-lg border border-slate-100 object-cover"
            alt={`${job.createdBy?.username ?? "Company"} logo`}
          />
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-base font-semibold text-slate-950 sm:text-lg">
              {job.title}
            </CardTitle>
            <CardDescription className="mt-1 truncate text-sm text-slate-500">
              {job.createdBy?.username}
            </CardDescription>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isBookmarked ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
          disabled={loadingBookmarks}
          onClick={handleBookmark}
          className="-mr-2 -mt-2 shrink-0 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <DollarSign className="h-4 w-4 text-slate-400" />
            {job.salaryRange || "Salary not listed"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            {job.location || "Location not listed"}
          </span>
          <Badge className="rounded-md border-slate-200 bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-100">
            {job.jobType}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5 lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-lg border-slate-300 text-slate-700"
            >
              View details
            </Button>
          </DrawerTrigger>
          <MobileJobDetails job={job} />
        </Drawer>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
