"use client";
import {
  Bookmark,
  Sparkles,
  Waypoints,
  Menu,
  Mail,
} from "lucide-react";
import { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserContext } from "@/app/context/userContext";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "./ui/dialog";
import UploadProfileImage from "./uploadProfileImage";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { user } = useContext(UserContext) as any;
  const pathname = usePathname();

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
    <nav className="sticky top-0 z-10 h-16 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <h1 className="md:text-2xl text-[16px] font-bold text-blue-600 flex items-center">
            <Waypoints className="mr-2" /> JobSmart
          </h1>
        </Link>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
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
                  href="/"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === "/" ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  <Waypoints className="h-5 w-5" />
                  Find jobs
                </Link>
                <Link
                  href="/ai-recommended-jobs"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === "/ai-recommended-jobs" ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  <Sparkles className="h-5 w-5" />
                  AI matches
                </Link>

                <Link href="/saved" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === "/saved" ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100"}`}>
                  <Bookmark className="h-5 w-5" />
                  My jobs
                </Link>

                <Link href="/room" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === "/room" ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-100"}`}>
                  <Mail className="h-5 w-5" />
                  Messages
                </Link>
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
                          <AvatarFallback>{user?.username?.slice(0, 1) || "U"}</AvatarFallback>
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

        <div className="hidden items-center gap-1 lg:flex">
          {[
            { href: "/", label: "Find jobs" },
            { href: "/ai-recommended-jobs", label: "AI matches" },
            { href: "/saved", label: "My jobs" },
            { href: "/room", label: "Messages" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-800"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle showLabel className="ml-1 text-slate-600 hover:bg-slate-100" />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 rounded-full pl-1 pr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{user?.username?.slice(0, 1) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-28 truncate text-sm font-medium text-slate-700">
                    {user?.username || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                      Upload profile image
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <UploadProfileImage />
                </Dialog>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-lg">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
