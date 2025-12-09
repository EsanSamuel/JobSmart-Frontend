"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const api = useApi();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      redirect("/");
    }
  }, [session?.user]);

  const onReset = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (password !== confirmPassword) {
        console.log("Password does not match!");
        return;
      }
      if (!password) {
        return null;
      }
      const response = await api.post("/api/v1/users/reset-password", {
        token,
        password,
      });
      console.log(response);
      if (response) {
        alert("Password changed!");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            required
            className=""
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Field>
        <Field>
          {isLoading ? (
            <Button type="submit" className="flex items-center-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              Reseting password...
            </Button>
          ) : (
            <Button type="submit" onClick={onReset}>
              Reset
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
