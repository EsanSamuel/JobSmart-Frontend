"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CompanyRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const { user } = useContext(UserContext) as any;
  const router = useRouter();

  useEffect(() => {
    if (user && user?.role === "USER") {
      console.log("Only Company can view this page");
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  //if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">{children}</div>
    </SidebarProvider>
  );
}
