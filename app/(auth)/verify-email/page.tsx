"use client";
import { useApi } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function VerifyPage() {
  const api = useApi();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("");
  const [verifyingEmail, setVerfyingEmail] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus("Invalid token");
      return;
    }

    const verifyEmail = async () => {
      try {
        setVerfyingEmail(true);
        const res = await api.post(`/api/v1/users/verify-email`, {
          token,
        });
        console.log(res);
        if (res) {
          setStatus("Email verified! You can now log in.");
          router.push("/login");
        } else {
          setStatus("Verification failed or token expired.");
        }
      } catch (err) {
        setStatus("Something went wrong.");
      } finally {
        setVerfyingEmail(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="h-screen flex items-center justify-center">
        {verifyingEmail && (
          <p className="flex gap-2 items-center">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> Verifying
            Email...
          </p>
        )}
        {status}
      </div>
    </Suspense>
  );
}
