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
import { useEffect, useState } from "react";
import api from "@/app/libs/axios";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { data: session, status } = useSession();
  const [role, setRole] = useState("USER");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  }, [session?.user]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        console.log("Password does not match!");
        return;
      }
      const response = await api.post("/api/v1/users", {
        username,
        email,
        password,
        role,
      });
      console.log(response);
      if (response) {
        signIn("credentials", {
          email,
          password,
        });
      }
    } catch (error) {
      console.log(error);
    }
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            className={`border-gray-300 ${
              role === "USER" && "border-blue-400"
            }`}
            onClick={() => setRole("USER")}
          >
            User
          </Button>
          <Button
            variant="outline"
            type="button"
            className={`border-gray-300 ${
              role === "COMPANY" && "border-blue-400"
            }`}
            onClick={() => setRole("COMPANY")}
          >
            Company
          </Button>
        </Field>
        <Field>
          <FieldLabel htmlFor="name">
            {role === "USER" ? "Full Name" : "Company Name"}
          </FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="border border-gray-300"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">
            {" "}
            {role === "USER" ? "Email" : "Company Email"}
          </FieldLabel>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="border border-gray-300"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            className="border border-gray-300"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit" className="" onClick={handleSignUp}>
            Create Account
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={LoginWithGoogle}>
            <FcGoogle />
            Sign up with Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
