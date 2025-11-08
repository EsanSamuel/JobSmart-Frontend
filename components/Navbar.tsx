"use client";
import {
  Bell,
  Bookmark,
  Sparkles,
  GalleryVerticalEnd,
  Waypoints,
  Menu,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserContext } from "@/app/context/userContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/libs/axios";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { user, AIRecommendedJobs } = useContext(UserContext) as any;

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    if (user?.role === "COMPANY") {
      console.log("Only Users can view this page");
      redirect("/dashboard");
    }
  }, [user]);

  return (
    <nav className="border-b border-gray-300 bg-white px-5 xl:px-[12%] py-4 fixed w-full mb-10">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <Waypoints className="mr-2" /> JobSmart
          </h1>
        </Link>

        <div className="lg:hidden md:hidden sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                {" "}
                <Menu className="text-gray-700" size="17" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col  gap-3 py-10">
                <Link
                  href="/ai-recommended-jobs"
                  className="flex gap-2 items-center"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-blue-50"
                    title="AI Recommended Jobs"
                  >
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-[10px]">
                      {AIRecommendedJobs?.length}
                    </Badge>
                  </Button>
                  <p className="text-[12px]">AI Recommendations</p>
                </Link>

                <Link href="/saved" className="flex gap-2 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-blue-50"
                    title="Saved Jobs"
                  >
                    <Bookmark className="h-5 w-5 text-gray-600" />
                  </Button>
                  <p className="text-[12px]">My Jobs</p>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-blue-50"
                      >
                        <Bell className="h-5 w-5 text-gray-600" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-[10px]">
                          5
                        </Badge>
                      </Button>
                      <p className="text-[12px]">Notifications</p>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                      <p className="font-medium text-sm">
                        New job match found!
                      </p>
                      <p className="text-xs text-gray-500">
                        Senior Frontend Developer at Google
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                      <p className="font-medium text-sm">
                        Application status updated
                      </p>
                      <p className="text-xs text-gray-500">
                        Your application has been viewed
                      </p>
                      <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                      <p className="font-medium text-sm">
                        New message from recruiter
                      </p>
                      <p className="text-xs text-gray-500">
                        Meta wants to schedule an interview
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center text-blue-600 cursor-pointer">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <SheetFooter>
                {!session?.user ? (
                  <a href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </a>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Avatar onClick={() => signOut()}>
                      <AvatarImage src={user?.profileImage} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-700">{user?.username}</p>
                    </div>
                  </div>
                )}
                <Button>Post a Job</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3 sm:flex hidden">
          <Link href="/ai-recommended-jobs">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-blue-50"
              title="AI Recommended Jobs"
            >
              <Sparkles className="h-5 w-5 text-blue-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-blue-600 text-[10px]">
                {AIRecommendedJobs?.length}
              </Badge>
            </Button>
          </Link>

          <Link href="/saved">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-blue-50"
              title="Saved Jobs"
            >
              <Bookmark className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-50"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-[10px]">
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                <p className="font-medium text-sm">New job match found!</p>
                <p className="text-xs text-gray-500">
                  Senior Frontend Developer at Google
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                <p className="font-medium text-sm">
                  Application status updated
                </p>
                <p className="text-xs text-gray-500">
                  Your application has been viewed
                </p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                <p className="font-medium text-sm">
                  New message from recruiter
                </p>
                <p className="text-xs text-gray-500">
                  Meta wants to schedule an interview
                </p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Auth Buttons */}
          {!session?.user ? (
            <a href="/login">
              <Button variant="ghost">Sign In</Button>
            </a>
          ) : (
            <Avatar onClick={() => signOut()}>
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <Button>Post a Job</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
