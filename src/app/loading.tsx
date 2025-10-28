"use client";

import { LoaderOne } from "@/components/ui/loader";
import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#1d1d1d] text-white">
      <LoaderOne />
    </div>
  );
}
