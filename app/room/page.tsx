"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Message, Room, user } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";
import { UserContext } from "../context/userContext";
import { io, Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import {
  Search,
  MessageSquare,
  Users,
  Clock,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Page = () => {
  const { user } = React.useContext(UserContext) as any;
  const api = useApi();
  const { data: session } = useSession();
  const [searchChat, setSearchChat] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const pathname = usePathname();
  const roomId = pathname.split("/room/")[1];
  const [showUnreadsOnly, setShowUnreadsOnly] = React.useState(false);

  const socketRef = React.useRef<Socket | null>(null);

  const {
    isPending,
    error,
    data: rooms,
  } = useQuery({
    queryKey: ["rooms", session?.user?.id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/rooms/${session?.user?.id}/user`);
      console.log("Rooms", response.data.data);
      return response.data.data;
    },
  });

  const filterRooms = (search: string) => {
    if (!search) return rooms;

    return rooms?.filter((room: Room) =>
      room.users?.some((user: user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  React.useEffect(() => {
    socketRef.current = io("https://jobsmart-backend.onrender.com");

    socketRef.current?.emit("joinRoom", {
      userId: user?.id,
      username: user?.username,
      roomId: roomId,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on("newMessages", (msg: Message) => {
      console.log("last msg:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const roomName = (index: number) => {
    const name = rooms[index].users?.filter(
      (user: user) => user.id !== session?.user.id
    );
    return name?.[0]?.username || "Unknown";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const joinRoom = (index: number) => {
    socketRef.current?.emit("joinRoom", {
      userId: user?.id,
      username: user?.username,
      roomId: rooms?.[index]?.id,
    });
  };

  const getUnreadCount = (room: Room) => {
    // Mock unread count - replace with actual logic
    return Math.floor(Math.random() * 5);
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="flex flex-col w-full md:hidden">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Messages
                  </h1>
                  <p className="text-xs text-gray-500">
                    {rooms?.length || 0} conversations
                  </p>
                </div>
              </div>

              <Label className="flex items-center gap-2 text-sm cursor-pointer">
                <span className="text-gray-600">Unreads</span>
                <Switch
                  checked={showUnreadsOnly}
                  onCheckedChange={setShowUnreadsOnly}
                  className="shadow-none"
                />
              </Label>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchChat}
                onChange={(e) => setSearchChat(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filterRooms(searchChat)?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No conversations found
              </h3>
              <p className="text-sm text-gray-500">
                Start chatting with recruiters and employers
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filterRooms(searchChat)?.map((room: Room, index: number) => {
                const unreadCount = getUnreadCount(room);
                const lastMessage = room.messages?.[room.messages.length - 1];
                const otherUserName = roomName(index);

                return (
                  <a
                    href={`/room/${room.id}`}
                    key={room.id}
                    onClick={() => joinRoom(index)}
                    className={cn(
                      "flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                      roomId === room.id &&
                        "bg-blue-50 hover:bg-blue-50 border-l-4 border-blue-600"
                    )}
                  >
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                        {getInitials(otherUserName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {otherUserName}
                        </h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-500 ml-2 shrink-0">
                            {formatTime(lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {lastMessage?.content || "No messages yet"}
                        </p>
                        {unreadCount > 0 && (
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-5 px-2 shrink-0">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Empty State */}
      <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto">
            <MessageSquare className="h-12 w-12 text-blue-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Messages
            </h1>
            <p className="text-gray-600 text-lg">
              Select a conversation to start chatting
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">Connect</h3>
              <p className="text-xs text-gray-600 mt-1">Chat with employers</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Clock className="h-6 w-6 text-indigo-600 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">Real-time</h3>
              <p className="text-xs text-gray-600 mt-1">Instant messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
