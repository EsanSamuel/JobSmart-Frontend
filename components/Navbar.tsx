"use client";
import {
  Bell,
  Bookmark,
  Sparkles,
  GalleryVerticalEnd,
  Waypoints,
  Menu,
  Mail,
  Upload,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserContext } from "@/app/context/userContext";
import { useQuery } from "@tanstack/react-query";
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
import { Dialog, DialogTrigger } from "./ui/dialog";
import UploadProfileImage from "./uploadProfileImage";

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
    <nav className="border-b border-gray-300 bg-white px-5 xl:px-[12%] py-4 fixed w-full mb-10 z-10">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="md:text-2xl text-[16px] font-bold text-blue-600 flex items-center">
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

                <Link href="/room" className="flex gap-2 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-blue-50"
                    title="Inbox"
                  >
                    <Mail className="h-5 w-5 text-gray-600" />
                  </Button>
                  <p className="text-[12px]">Messages</p>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar>
                          <AvatarImage src={user?.profileImage} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <Dialog>
                          <DialogTrigger asChild>
                            <p className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                              Upload profile image
                            </p>
                          </DialogTrigger>
                          <UploadProfileImage />
                        </Dialog>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                          Log out
                          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div>
                      <p className="text-gray-700">{user?.username}</p>
                    </div>
                  </div>
                )}
                {/*<Button>Post a Job</Button>*/}
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

          <Link href="/room">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-blue-50"
              title="Inbox"
            >
              <Mail className="h-5 w-5 text-gray-600" />
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
            <div className="flex gap-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <Dialog>
                    <DialogTrigger asChild>
                      <p className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                        Upload profile image
                      </p>
                    </DialogTrigger>
                    <UploadProfileImage />
                  </Dialog>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {/* <Button>Post a Job</Button>*/}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
