"use client";
import React, { useContext, useState } from "react";
import Home from "@/components/Home";
import Navbar from "@/components/Navbar";
import { UserContext } from "../context/userContext";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useContext(UserContext) as any;
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="bg-white h-screen overflow-hidden">
      <Navbar />
      <Home />
    </div>
  );
};

export default Page;
