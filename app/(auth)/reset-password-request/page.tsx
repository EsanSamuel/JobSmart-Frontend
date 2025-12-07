"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { SignupForm } from "@/components/signup-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";

export default function PasswordResetRequestPage() {
  const api = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const request = await api.post("/api/v1/users/reset-password-request", {
      email,
    });
    console.log(request.data.data);
    if (request) {
      alert("Mail sent!");
    }
  };
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            JobSmart
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Request Password Reset</h1>
              </div>
              <Input
                className="border border-gray-300"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
              <Button className="w-full" onClick={handleRequest}>
                Request password change
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="woman.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
