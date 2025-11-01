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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session?.user) {
      redirect("/");
    }
  }, [session?.user]);

  const onLogIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email && !password) {
      return null;
    }
    await signIn("credentials", {
      email,
      password,
    });
  };

  const LoginWithGoogle = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
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
            className="border border-gray-300"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="border border-gray-300"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <Button type="submit" onClick={onLogIn}>
            Login
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={LoginWithGoogle}>
            <FcGoogle />
            Login with Google
          </Button>
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
