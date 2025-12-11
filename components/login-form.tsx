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
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  useEffect(() => {
    if (session?.user) {
      redirect("/");
    }
  }, [session?.user]);

  const onLogIn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!email && !password) {
        return null;
      }
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.ok) {
        toast.success("Login successful!");
      }
      if (res?.error) {
        console.log(res.error);
        toast.error(res.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoginWithGoogle = async () => {
    setIsLoading2(true);
    try {
      const res = await signIn("google");
      if (res?.ok) {
        toast.success("Login successful!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading2(false);
    }
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/reset-password-request"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          {isLoading ? (
            <Button
              type="submit"
              onClick={onLogIn}
              className="flex items-center-center gap-2"
            >
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              Signing in...
            </Button>
          ) : (
            <Button type="submit" onClick={onLogIn}>
              Login
            </Button>
          )}
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          {isLoading2 ? (
            <Button
              variant="outline"
              type="button"
              className="flex items-center-center gap-2"
              onClick={LoginWithGoogle}
            >
              <FcGoogle />
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> Signing
              in...
            </Button>
          ) : (
            <Button variant="outline" type="button" onClick={LoginWithGoogle}>
              <FcGoogle />
              Login with Google
            </Button>
          )}
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
