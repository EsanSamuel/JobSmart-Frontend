"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  ArrowLeft,
  MoreVertical,
  Paperclip,
} from "lucide-react";
import { Message, user } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApi } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function ChatRoom() {
  const api = useApi();
  const { roomId } = useParams();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    isPending,
    error,
    data: room,
  } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/rooms/${roomId}`);
      console.log("Room", response.data.data);
      return response.data.data;
    },
  });

  useEffect(() => {
    if (room?.messages) {
      console.log("room messages", room.messages);
      setMessages(room.messages);
    }
  }, [room]);

  useEffect(() => {
    if (!session?.user?.id || !roomId) return;

    console.log("Initializing socket connection...");
    socketRef.current = io("https://jobsmart-backend.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);

      // Join room after connection is established
      socketRef.current?.emit("joinRoom", {
        userId: session.user.id,
        username: session.user.name,
        roomId: roomId,
      });
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketRef.current.on("newMessages", (msg: Message) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("user_joined", (data) => {
      console.log("User joined:", data);
    });

    socketRef.current.on("userCounts", (data) => {
      console.log("User count:", data);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socketRef.current.on("userTyping", ({ username }) => {
      setTypingUser(username);
      setIsTyping(true);
    });

    socketRef.current.on("userStoppedTyping", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    return () => {
      console.log("Disconnecting socket...");
      socketRef.current?.disconnect();
    };
  }, [session?.user?.id, session?.user?.name, roomId]);

  const roomName = () => {
    const name = room?.users?.filter(
      (user: user) => user.id !== session?.user.id
    );
    return name?.[0];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (files) {
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewFiles(urls);
      return () => {
        if (previewFiles) {
          previewFiles.forEach((url) => URL.revokeObjectURL(url));
        }
      };
    }
  }, [files]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    const fileArray = Array.from(fileList);
    setFiles(fileArray);
    setLoadingFiles(true);

    let Files: string[] = [];
    for (const file of fileArray) {
      const presignedUrlResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      const { presignedUrl, permanentUrl } = await presignedUrlResponse.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      console.log(permanentUrl);
      Files.push(permanentUrl);
    }
    setFileUrls(Files);
    console.log(Files);
    setLoadingFiles(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    console.log("Sending message:", {
      content: newMessage,
      senderId: session?.user?.id,
      roomId,
    });

    socketRef.current?.emit("sendMessage", {
      content: newMessage,
      senderId: session?.user?.id,
      roomId,
      Files: fileUrls,
    });

    setNewMessage("");
    setFileUrls([]);
    setFiles([]);
    setIsSending(false);
  };

  const handleDelete = (messageId: string, userId: string, roomId: string) => {
    try {
      socketRef.current?.emit("deleteMessage", {
        messageId,
        userId,
        roomId,
      });
      setMessages((prev) =>
        prev.filter((msg: Message) => msg.id !== messageId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!typingTimeoutRef.current) {
      socketRef.current?.emit("typing", {
        username: session?.user?.name,
        roomId,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { roomId });
      typingTimeoutRef.current = null;
    }, 3000);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      <div className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          {roomName()?.profileImage ? (
            <Avatar>
              <AvatarImage src={roomName()?.profileImage} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 from-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {roomName()?.[0]?.username.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h2 className="font-semibold text-gray-900">
              {roomName()?.username || "Loading..."}
            </h2>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === session?.user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[70%] ${
                    isOwn ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {!isOwn && (
                    <>
                      {roomName()?.profileImage ? (
                        <Avatar>
                          <AvatarImage src={roomName()?.profileImage} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 from-blue-500  rounded-full shrink-0" />
                      )}
                    </>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2 relative group ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Images Grid */}
                        {message.Files && message.Files.length > 0 && (
                          <div
                            className={`grid gap-2 ${
                              message.Files.length === 1
                                ? "grid-cols-1"
                                : message.Files.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                            }`}
                          >
                            {message.Files.map((url, idx) => (
                              <div
                                key={idx}
                                className="relative overflow-hidden rounded-lg"
                              >
                                {url.endsWith(".jpg") ||
                                url.endsWith(".jpeg") ||
                                url.endsWith(".png") ? (
                                  <img
                                    src={url}
                                    alt={`attachment-${idx}`}
                                    className="w-full max-w-[200px] h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onClick={() => window.open(url, "_blank")}
                                  />
                                ) : url.endsWith(".pdf") ? (
                                  <a href={url}>
                                    <iframe
                                      src={url}
                                      //alt={`attachment-${idx}`}
                                      className="w-full max-w-[200px] h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                                      onClick={() => window.open(url, "_blank")}
                                    />
                                  </a>
                                ) : url.endsWith(".mp4") ? (
                                  <video
                                    src={url}
                                    //alt={`attachment-${idx}`}
                                    className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onClick={() => window.open(url, "_blank")}
                                  />
                                ) : (
                                  <></>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Text */}
                        {message.content && (
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                        )}
                      </div>

                      {isOwn && (
                        <button
                          onClick={() =>
                            handleDelete(
                              message.id,
                              session?.user?.id!,
                              roomId as string
                            )
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full items-center justify-center
                           text-white opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex"
                          title="Delete message"
                        >
                          <span className="text-xs">×</span>
                        </button>
                      )}
                    </div>
                    <p
                      className={`text-xs text-gray-500 mt-1 px-1 ${
                        isOwn ? "text-right" : "text-left"
                      }`}
                    >
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isTyping && typingUser !== session?.user?.name && (
          <div className="px-4 py-2 text-sm text-gray-600 bg-gray-100">
            <span className="italic">{typingUser} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      // Replace the bottom input section (starting from line 356) with this:
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        {/* File Previews */}
        {previewFiles.length > 0 && (
          <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-full">
            {previewFiles.map((url, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={url}
                  width={200}
                  height={200}
                  alt={url}
                  className="w-full h-20 rounded-2xl object-cover"
                />
                {loadingFiles && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 min-w-0 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            disabled={isSending}
          />

          {/* File Upload Button */}
          <div className="relative shrink-0">
            <Input
              id="files"
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFile}
            />
            <button
              disabled={loadingFiles}
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shadow-md"
            >
              {loadingFiles ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
              ) : (
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shadow-md shrink-0"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
