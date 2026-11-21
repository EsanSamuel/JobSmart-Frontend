"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { useApi } from "@/hooks/useApi";
import { Room, user as User } from "@/types";
import { useMemo, useState } from "react";

export function MessageSidebar() {
  const api = useApi();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const { data: rooms = [], isPending, isError } = useQuery({
    queryKey: ["rooms", session?.user?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/rooms/${session?.user?.id}/user`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
    enabled: !!session?.user?.id,
  });

  const filteredRooms = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return rooms;
    return rooms.filter((room: Room) =>
      otherUser(room, session?.user?.id)?.username?.toLocaleLowerCase().includes(term)
    );
  }, [rooms, search, session?.user?.id]);

  return (
    <Sidebar className="border-r border-slate-200" collapsible="offcanvas">
      <SidebarHeader className="gap-4 border-b border-slate-200 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">JobSmart</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            {rooms.length} {rooms.length === 1 ? "conversation" : "conversations"}
          </p>
        </div>
        <label className="relative block">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search people"
            aria-label="Search conversations"
            className="h-10 rounded-lg border-slate-200 bg-slate-50 pl-9"
          />
        </label>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {isPending ? (
          <p className="px-3 py-6 text-sm text-slate-500">Loading conversations…</p>
        ) : isError ? (
          <p className="px-3 py-6 text-sm text-red-600">Couldn’t load conversations. Try refreshing.</p>
        ) : filteredRooms.length === 0 ? (
          <p className="px-3 py-6 text-sm text-slate-500">
            {search ? "No conversations match that name." : "Your conversations will appear here."}
          </p>
        ) : (
          <nav aria-label="Conversations" className="space-y-1">
            {filteredRooms.map((room: Room) => {
              const contact = otherUser(room, session?.user?.id);
              const name = contact?.username || "Conversation";
              const lastMessage = room.messages?.[room.messages.length - 1];
              const active = pathname === `/room/${room.id}`;

              return (
                <Link
                  key={room.id}
                  href={`/room/${room.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-950"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Avatar className="size-11 shrink-0">
                    <AvatarImage src={contact?.profileImage || undefined} alt="" className="object-cover" />
                    <AvatarFallback className="bg-blue-100 font-medium text-blue-800">
                      {initials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{name}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {lastMessage?.content || "Start a conversation"}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function otherUser(room: Room, currentUserId?: string) {
  return room.users?.find((person: User) => person.id !== currentUserId);
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}
