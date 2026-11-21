"use client";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, UIEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import Compatability from "./check-compatability";
import { Dialog, DialogTrigger } from "./ui/dialog";
import Apply from "./Apply";
import JobCard from "./JobCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/app/context/userContext";
import { job } from "@/types";
import FilterModal from "./filterModal";
import { formatDistance } from "date-fns";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { responseList } from "@/lib/response";

interface DiscoveryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  visible: boolean;
}

const DiscoveryHeader = ({
  search,
  onSearchChange,
  onSubmit,
  visible,
}: DiscoveryHeaderProps) => (
  <div
    aria-hidden={!visible}
    inert={!visible}
    className={`grid shrink-0 transition-[grid-template-rows,opacity] duration-300 ease-out ${visible ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}
  >
    <div className="min-h-0 overflow-hidden">
      <header className="sticky top-16 z-20 mx-auto w-full max-w-[1440px] bg-slate-50 px-4 pt-5 sm:px-6 lg:static lg:bg-transparent lg:pt-8 dark:bg-background lg:dark:bg-transparent">
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 sm:items-end">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700 sm:text-xs">
              Discover opportunities
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:mt-2 sm:text-3xl lg:text-[34px]">
              Find work that fits your next move
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-600 sm:mt-2 sm:text-base sm:leading-6">
              Browse open roles, compare details, and find your next team.
            </p>
          </div>
          <Link href="/ai-recommended-jobs" className="mt-4 shrink-0 sm:mt-0">
            <Button variant="outline" aria-label="View AI matches" className="h-9 gap-2 rounded-lg border-slate-300 bg-white px-3 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 sm:h-10 sm:px-4">
              <Sparkles className="h-4 w-4 text-blue-700" />
              <span className="hidden sm:inline">AI matches</span>
            </Button>
          </Link>
        </div>

        <form onSubmit={onSubmit} className="mb-6 flex gap-2 sm:mb-7">
          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <Search aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-slate-500" />
            <Input
              type="search"
              aria-label="Search jobs by role, company, or skill"
              placeholder="Role, company, or skill"
              onChange={(event) => onSearchChange(event.target.value)}
              value={search}
              className="h-full min-w-0 border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-slate-500 focus-visible:ring-0"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" className="h-12 rounded-lg px-5 font-medium">
            Search
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="h-12 gap-2 rounded-lg border-slate-300 px-3 sm:px-4">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </DialogTrigger>
            <FilterModal />
          </Dialog>
        </form>
      </header>
    </div>
  </div>
);

const Home = () => {
  const api = useApi();
  const { user } = useContext(UserContext) as any;
  const [selectedJob, setSelectedJob] = useState<
    (job & { createdBy: any }) | null
  >(null);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [discoveryHeaderVisible, setDiscoveryHeaderVisible] = useState(true);
  const activeScrollSource = useRef<EventTarget | null>(null);
  const scrollMotion = useRef(
    new WeakMap<EventTarget, { position: number; direction: "up" | "down" | null; distance: number }>()
  );
  const queryClient = useQueryClient();

  const updateHeaderForScroll = useCallback((source: EventTarget, position: number) => {
    if (activeScrollSource.current !== source) {
      activeScrollSource.current = source;
      scrollMotion.current.set(source, { position, direction: null, distance: 0 });
      if (position <= 16) setDiscoveryHeaderVisible(true);
      return;
    }

    const previous = scrollMotion.current.get(source) ?? {
      position: 0,
      direction: null,
      distance: 0,
    };
    const delta = position - previous.position;

    if (position <= 16) {
      setDiscoveryHeaderVisible(true);
      scrollMotion.current.set(source, { position, direction: null, distance: 0 });
      return;
    }

    if (Math.abs(delta) < 3) return;
    const direction = delta > 0 ? "down" : "up";
    const distance = previous.direction === direction
      ? previous.distance + Math.abs(delta)
      : Math.abs(delta);

    if (direction === "down" && distance >= 56) {
      setDiscoveryHeaderVisible(false);
    } else if (direction === "up" && distance >= 48) {
      setDiscoveryHeaderVisible(true);
    }

    scrollMotion.current.set(source, { position, direction, distance });
  }, []);

  const handlePaneScroll = (event: UIEvent<HTMLElement>) => {
    updateHeaderForScroll(event.currentTarget, event.currentTarget.scrollTop);
  };

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 1023px)");
    if (!mobileViewport.matches) return;
    const onWindowScroll = () => updateHeaderForScroll(window, window.scrollY);
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [updateHeaderForScroll]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearchTerm(search.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const {
    isPending: loadingJobs,
    error: isError,
    data: jobs,
  } = useQuery({
    queryKey: ["jobs", searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("filter", searchTerm);
      const query = params.toString();
      const response = await api.get(
        `/api/v1/jobs${query ? `?${query}` : ""}`
      );
      return response.data.data;
    },
  });

  useEffect(() => {
    if (!jobs?.length) {
      setSelectedJob(null);
      return;
    }
    if (!selectedJob || !jobs.some((job: job) => job.id === selectedJob.id)) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const {
    data: resumes,
  } = useQuery({
    queryKey: ["resumes", selectedJob?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/jobs/resume/${selectedJob?.id}`);
      return responseList(response);
    },
    enabled: !!selectedJob?.id,
  });

  const {
    isPending: loadingBookmarks,
    data: jobBookmarks,
  } = useQuery({
    queryKey: ["jobbookmarks", selectedJob?.id],
    queryFn: async () => {
      if (!selectedJob?.id) return null;
      const response = await api.get(
        `/api/v1/bookmarks/job/${selectedJob?.id}`
      );
      return response.data.data;
    },
    enabled: !!selectedJob?.id,
  });

  const hasApplied = useMemo(() => {
    if (!resumes || !user?.id) return false;
    const resume = resumes?.map((resume: any) => resume?.user?.id);
    return resume?.includes(user?.id);
  }, [resumes, user?.id]);

  const isBookmarked = useMemo(() => {
    if (!jobBookmarks || !user?.id) return false;
    const bookmarked = jobBookmarks?.map((bookmark: any) => bookmark?.userId);
    return bookmarked?.includes(user?.id);
  }, [jobBookmarks, user?.id]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(search.trim());
  };

  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#cbd5e1 transparent",
  };

  if (loadingJobs) {
    return (
      <main style={{ overflowAnchor: "none" }} className="min-h-[calc(100dvh-4rem)] bg-slate-50/80 dark:bg-background lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
        <DiscoveryHeader
          search={search}
          onSearchChange={setSearch}
          onSubmit={handleSearch}
          visible={discoveryHeaderVisible}
        />
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-4 py-20 text-center sm:px-6 lg:px-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600">Finding roles for you…</p>
        </div>
      </main>
    );
  }

  if (isError || jobs?.length === 0) {
    return (
      <main style={{ overflowAnchor: "none" }} className="min-h-[calc(100dvh-4rem)] bg-slate-50/80 dark:bg-background">
        <DiscoveryHeader
          search={search}
          onSearchChange={setSearch}
          onSubmit={handleSearch}
          visible={discoveryHeaderVisible}
        />
        <div className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              {isError
                ? "We couldn’t load the job listings"
                : search
                  ? `No roles found for “${search}”`
                  : "No open roles right now"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {isError
                ? "Please try again in a moment."
                : "Try another search or come back soon to see new opportunities."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const handleBookmark = async () => {
    if (!user?.id || !selectedJob?.id) {
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
        await api.post("/api/v1/bookmarks", {
          authId: user.id,
          jobId: selectedJob.id,
        });
        toast.success("Job saved to your list.");
      }

      queryClient.invalidateQueries({
        queryKey: ["jobbookmarks", selectedJob?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["bookmark", user.id] });
    } catch (error) {
      toast.error("Couldn’t update your saved jobs. Please try again.");
    }
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

      <main style={{ overflowAnchor: "none" }} className="flex min-h-[calc(100dvh-4rem)] flex-col bg-slate-50/80 dark:bg-background lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
        <DiscoveryHeader
          search={search}
          onSearchChange={setSearch}
          onSubmit={handleSearch}
          visible={discoveryHeaderVisible}
        />

        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-8 sm:px-6 lg:flex lg:min-h-0 lg:gap-6 lg:px-8 lg:pb-6">
          <section className="min-w-0 lg:flex lg:min-h-0 lg:w-[420px] lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:pr-5">
            <div className="mb-3 flex items-baseline justify-between lg:mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                Open roles
              </h2>
              <span className="text-sm text-slate-500">
                {jobs?.length ?? 0} found
              </span>
            </div>

            <div
              className="space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2"
              style={scrollbarStyles as any}
              onScroll={handlePaneScroll}
            >
              {jobs?.map((job: any, index: number) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={index}
                  selectedJob={selectedJob}
                  setSelectedJob={setSelectedJob}
                />
              ))}
            </div>
          </section>

          {selectedJob && (
            <section className="hidden min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white lg:flex">
                <div
                  className="flex-1 overflow-y-auto custom-scrollbar"
                  style={scrollbarStyles as any}
                  onScroll={handlePaneScroll}
                >
                  <div className="p-7 xl:p-9">
                    <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                          {selectedJob?.jobType} opportunity
                        </p>
                        <h2 className="font-semibold text-[30px] leading-tight tracking-tight text-slate-950">
                          {selectedJob?.title}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          {selectedJob?.createdBy?.username}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {selectedJob?.location}
                        </span>
                        <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          {selectedJob?.salaryRange}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          {selectedJob?.Resume?.length ?? 0} applicants
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          Posted{" "}
                          {formatDistance(
                            new Date(selectedJob.createdAt),
                            new Date(),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>

                      <div className="flex gap-3 pt-1">
                        {selectedJob.isClosed ? (
                          <Button className="h-11 flex-1 bg-slate-200 text-slate-600 hover:bg-slate-200" disabled>
                            This Job is closed
                          </Button>
                        ) : (
                          <div className="min-w-0 flex-1">
                            {hasApplied ? (
                              <Button className="h-11 flex-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-50" disabled>
                                You have Applied
                              </Button>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="h-11 flex-1 rounded-lg">
                                    Apply now
                                  </Button>
                                </DialogTrigger>
                                {selectedJob && <Apply job={selectedJob} />}
                              </Dialog>
                            )}
                          </div>
                        )}
                        {loadingBookmarks ? (
                          <Button className="bg-gray-300" disabled>
                            <Bookmark size={20} />
                          </Button>
                        ) : isBookmarked ? (
                          <Button
                            variant="outline"
                            className="h-11 w-12 shrink-0 rounded-lg border-slate-300 text-blue-700"
                            aria-label="Remove saved job"
                            onClick={handleBookmark}
                          >
                            <BookmarkCheck size={20} className="fill-current" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="h-11 w-12 shrink-0 rounded-lg border-slate-300 text-slate-600 hover:text-blue-700"
                            onClick={handleBookmark}
                            aria-label="Save job"
                          >
                            <Bookmark size={20} />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mb-7">
                      <h3 className="mb-3 text-lg font-semibold text-slate-950">
                        Job description
                      </h3>
                      <p className="text-sm leading-7 text-slate-600">
                        {selectedJob?.description}
                      </p>

                      <div className="mt-6">
                        <h4 className="mb-2 text-sm font-semibold text-slate-900">
                          What you'll do:
                        </h4>

                        <ul className="space-y-2 text-sm leading-6 text-slate-600">
                          {selectedJob?.responsibilities.map(
                            (responsibility, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-blue-600">•</span>
                            <span>{responsibility}</span>
                          </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-7">
                      <h3 className="mb-3 text-lg font-semibold text-slate-950">
                        Requirements:
                      </h3>

                      <ul className="space-y-2 text-sm leading-6 text-slate-600">
                        {selectedJob?.requirements.map((requirement, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-blue-600">•</span>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-7">
                      <h3 className="mb-3 text-lg font-semibold text-slate-950">
                        Required skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob?.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-7">
                      <h3 className="mb-3 text-lg font-semibold text-slate-950">
                        Benefits
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedJob.benefits?.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
                            <span className="text-gray-600 text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="rounded-lg border-slate-300 px-5">
                            Check your match
                          </Button>
                        </DialogTrigger>
                        {selectedJob && <Compatability job={selectedJob} />}
                      </Dialog>
                    </div>
                  </div>
                </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
