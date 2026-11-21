"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MessageSidebar } from "@/components/message-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      className="!h-dvh !min-h-0 overflow-hidden"
      style={{ "--sidebar-width": "320px" } as React.CSSProperties}
    >
      <MessageSidebar />
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" aria-label="Open conversations" />
            <span className="text-sm font-semibold text-slate-900">Messages</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            <span>Back to jobs</span>
          </Link>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
