"use client";
import React, { useContext, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Search,
  Clock,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MyJobsCard from "@/components/MyJobsCard";
import { UserContext } from "@/app/context/userContext";
import { useApi } from "@/hooks/useApi";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState("BOOKMARK");
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("all");
  const {
    user,
    jobs,
    bookmarks,
    loadingBookmarks,
    bookmarkError,
    appliedJobs,
    loadingAppliedJobs,
    matchedJobs,
    loadingMatchedJobs,
  } = useContext(UserContext) as any;
  const toRecords = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.result)) return value.result;
    if (Array.isArray(value?.items)) return value.items;
    if (Array.isArray(value?.data)) return value.data;
    return [];
  };
  const bookmarkRecords = toRecords(bookmarks);
  const appliedRecords = toRecords(appliedJobs);
  const matchedRecords = toRecords(matchedJobs);
  const allJobs = Array.isArray(jobs) ? jobs : [];
  const allRecords = [...bookmarkRecords, ...appliedRecords, ...matchedRecords];
  const missingJobIds = Array.from(
    new Set(
      allRecords
        .filter((item: any) => {
          const jobId = item?.jobId ?? item?.job?.id ?? item?.Job?.id;
          return !item?.job && !item?.Job && jobId && !allJobs.some((job: any) => job.id === jobId);
        })
        .map((item: any) => item?.jobId ?? item?.job?.id ?? item?.Job?.id)
        .filter(Boolean)
    )
  );
  const missingJobQueries = useQueries({
    queries: missingJobIds.map((jobId) => ({
      queryKey: ["job", jobId],
      queryFn: async () => {
        const response = await api.get(`/api/v1/jobs/${jobId}`);
        const payload = response.data.data;
        return payload?.job ?? payload;
      },
      retry: false,
    })),
  });
  const activeRecords = selected === "BOOKMARK"
    ? bookmarkRecords
    : selected === "APPLIEDJOBS"
      ? appliedRecords
      : matchedRecords;
  const activeJobIds = new Set(activeRecords.map((item: any) => item?.jobId ?? item?.job?.id ?? item?.Job?.id));
  const activeMissingJobQueries = missingJobQueries.filter((_, index) => activeJobIds.has(missingJobIds[index]));
  const attachJob = (item: any) => {
      const jobId = item?.jobId ?? item?.job?.id ?? item?.Job?.id;
      const jobFromList = allJobs.find((job: any) => job.id === jobId);
      const missingJobIndex = missingJobIds.indexOf(jobId);
      const fetchedJob = missingJobIndex >= 0
        ? missingJobQueries[missingJobIndex]?.data
        : undefined;
      return {
        ...item,
        job: item?.job ?? item?.Job ?? jobFromList ?? fetchedJob,
      };
  };
  const savedItems = bookmarkRecords.map(attachJob).filter((item: any) => item?.job);
  const appliedItems = appliedRecords.map(attachJob).filter((item: any) => item?.job);
  const matchedItems = matchedRecords.map(attachJob).filter((item: any) => item?.job);
  const loadingSavedJobs =
    (selected === "BOOKMARK" && loadingBookmarks) ||
    (selected === "APPLIEDJOBS" && loadingAppliedJobs) ||
    (selected === "MATCHEDJOBS" && loadingMatchedJobs) ||
    activeMissingJobQueries.some((query) => query.isPending);
  const savedJobLookupFailed = activeMissingJobQueries.some((query) => query.isError);
  const items = selected === "BOOKMARK" ? savedItems : selected === "APPLIEDJOBS" ? appliedItems : matchedItems;
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item: any) => {
      const job = item?.job;
      const matchesSearch = !term || `${job?.title ?? ""} ${job?.createdBy?.username ?? ""} ${job?.location ?? ""}`.toLowerCase().includes(term);
      const matchesType = jobType === "all" || job?.jobType?.toLowerCase() === jobType;
      return matchesSearch && matchesType;
    });
  }, [items, search, jobType]);
  const averageMatch = matchedItems.length
    ? Math.round(matchedItems.reduce((sum: number, item: any) => sum + (item?.matchPercentage ?? 0), 0) / matchedItems.length)
    : 0;

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      await api.post(`/api/v1/bookmarks/${bookmarkId}`);
      await queryClient.invalidateQueries({ queryKey: ["bookmark", user?.id] });
      toast.success("Job removed from saved jobs.");
    } catch (error) {
      toast.error("Couldn’t remove this job. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold mb-2">
                {selected === "BOOKMARK" && "My Saved Jobs"}
                {selected === "APPLIEDJOBS" && "Applied Jobs"}
                {selected === "MATCHEDJOBS" && "AI Matched Jobs"}
              </h1>
              <p className="text-gray-600">
                {selected === "BOOKMARK"
                  ? bookmarkRecords.length
                  : selected === "APPLIEDJOBS"
                    ? appliedRecords.length
                    : matchedRecords.length}{" "}
                {(selected === "BOOKMARK"
                  ? bookmarkRecords.length
                  : selected === "APPLIEDJOBS"
                    ? appliedRecords.length
                    : matchedRecords.length) === 1
                  ? "opportunity"
                  : "opportunities"} in your list
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search saved jobs..."
                className="pl-10 h-11"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full sm:w-[180px] h-11">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={selected === "BOOKMARK"}
              className={`bg-white rounded-xl p-4 border  shadow-sm hover:shadow-md transition-shadow ${
                selected === "BOOKMARK" ? "border-blue-400" : "border-gray-200"
              }`}
              onClick={() => setSelected("BOOKMARK")}
              onKeyDown={(event) => event.key === "Enter" && setSelected("BOOKMARK")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {bookmarkRecords.length}
              </p>
              <p className="text-xs text-gray-600 font-medium">Saved Jobs</p>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-pressed={selected === "APPLIEDJOBS"}
              className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                selected === "APPLIEDJOBS"
                  ? "border-blue-300"
                  : " border-gray-200"
              }`}
              onClick={() => setSelected("APPLIEDJOBS")}
              onKeyDown={(event) => event.key === "Enter" && setSelected("APPLIEDJOBS")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {appliedRecords.length}
              </p>
              <p className="text-xs text-gray-600 font-medium">Applied</p>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-pressed={selected === "MATCHEDJOBS"}
              className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow ${
                selected === "MATCHEDJOBS"
                  ? "border-blue-300"
                  : " border-gray-200"
              }`}
              onClick={() => setSelected("MATCHEDJOBS")}
              onKeyDown={(event) => event.key === "Enter" && setSelected("MATCHEDJOBS")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {averageMatch}%
              </p>
              <p className="text-xs text-gray-600 font-medium">Avg Match</p>
            </div>
          </div>
        </div>

        {loadingSavedJobs ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-600">
            Loading your saved jobs…
          </div>
        ) : selected === "BOOKMARK" && bookmarkError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
            <p className="font-medium text-slate-900">
              We couldn’t load your saved jobs.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {Number((bookmarkError as any)?.response?.status) === 500
                ? "The server failed while loading bookmarks. Your saved list has not been confirmed as empty."
                : "There was a problem connecting to the bookmarks service. Your saved list has not been confirmed as empty."}
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => queryClient.refetchQueries({ queryKey: ["bookmark", user?.id] })}
            >
              Try again
            </Button>
          </div>
        ) : savedJobLookupFailed && filteredItems.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
            <p className="font-medium text-slate-900">
              We couldn’t load one or more saved listings.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Refresh the page to try loading them again.
            </p>
          </div>
        ) : (
        <div className="space-y-4">
          {filteredItems.map((item: any, index: number) => {
            return (
              <div key={item?.id ?? item?.job?.id ?? index}>
                <MyJobsCard
                  job={item.job}
                  index={index}
                  matchScore={item.matchPercentage}
                  onRemove={selected === "BOOKMARK" && item?.id ? () => handleDeleteBookmark(item.id) : undefined}
                />
              </div>
            );
          })}
        </div>
        )}

        {!loadingSavedJobs && filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search || jobType !== "all" ? "No matching jobs" : selected === "BOOKMARK" ? "No saved jobs yet" : "Nothing here yet"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {search || jobType !== "all"
                ? "Try adjusting your search or job type filter."
                : selected === "BOOKMARK"
                  ? "Save roles you’re interested in and they’ll be easy to find here."
                  : "Your activity will appear here as you explore opportunities."}
            </p>
            <Button className="gap-2" asChild>
              <a href="/">
              <Search className="h-4 w-4" />
              Browse opportunities
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
