"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useRouter } from "next/navigation";

export default function CompanyRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(UserContext) as any;
  const router = useRouter();

  useEffect(() => {
    if (user && user?.role === "USER") {
      console.log("Only Company can view this page");
      router.push("/");
    }
  }, [user, router]);

  //if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">{children}</div>
    </SidebarProvider>
  );
}
