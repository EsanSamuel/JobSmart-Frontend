"use client";

import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  return (
    <main className="flex h-full min-h-0 items-center justify-center bg-slate-50 px-6 py-10">
      <section className="max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <MessageSquareText aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
          Your conversations
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose someone from the list to continue chatting.
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-lg">
          <Link href="/">Explore jobs</Link>
        </Button>
      </section>
    </main>
  );
}
