"use client";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";

import { SignupForm } from "@/components/signup-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";

export default function PasswordResetRequestPage() {
  const api = useApi();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = await api.post("/api/v1/users/reset-password-request", {
        email,
      });
      console.log(request.data.data);
      if (request) {
        setVerificationMessage(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email to reset your password.
                </p>
              </div>
              <Input
                className="border border-gray-300"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
              {loading ? (
                <Button
                  className="w-full flex gap-3 items-center"
                  onClick={handleRequest}
                >
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />{" "}
                  Requesting password change...
                </Button>
              ) : (
                <Button className="w-full" onClick={handleRequest}>
                  Request password change
                </Button>
              )}

              {verificationMessage && (
                <div className="w-full border-green-500 border bg-green-200 rounded-2xl px-5 py-3 text-sm">
                  <p>Reset link sent to {email}. Check your inbox</p>
                </div>
              )}
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
