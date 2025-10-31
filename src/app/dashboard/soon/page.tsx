"use client";
import { AnimatedNoise } from "@/components/ui/dashboard-ui/soon-ui/noise";
import AnimatedPathText from "@/components/ui/dashboard-ui/soon-ui/text-along-path";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

function SoonPage() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  const rectPath =
    "M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20";
  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <AdvancedGradiant className="opacity-50" />
      </div>
      <div className="text-center p-8  rounded-2xl max-w-lg w-full transform transition-all duration-500 ">
        <AnimatedPathText
          path={rectPath}
          svgClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-20 sm:py-20"
          viewBox="-20 10 240 180"
          text="جاري العمل على تطوير الصفحة — سيتم اطلاقها قريبًا ـ جاري العمل على تطوير الصفحة — سيتم اطلاقها قريبًا ـ جاري العمل على تطوير الصفحة — سيتم اطلاقها قريبًا "
          textClassName="text-[10.6px] lowercase font-azeret-mono text-[#E85002]"
          duration={20}
          preserveAspectRatio="none"
          textAnchor="start"
        />
      </div>
    </div>
  );
}

const AdvancedGradiant = ({ className }: { className?: string }) => {
  return (
    <>
      <style>
        {`
            @keyframes size-bounce {
              50% scale(0.8)
              100% scale(1)
            }
            @keyframes spin {
              100% rotate(360deg)
            }
          `}
      </style>
      <div
        className={cn(
          "size-[400px] relative transition-all transform-gpu",
          className
        )}
      >
        <div className="absolute top-0 left-0 grid place-items-center w-full h-full transform-gpu">
          <div
            className={cn(
              "w-full h-full blur-3xl opacity-80 rounded-full transform-gpu"
            )}
            style={{
              background:
                "conic-gradient(#E85002, #C10801, #F16001, #D9C3AB, #333333, #646464, #000000)",
              animation: "spin 15s linear infinite",
            }}
          />
        </div>
        <div
          className="absolute top-0 left-0 grid place-items-center w-full h-full transform-gpu"
          style={{
            animation: "size-bounce 20s linear infinite",
          }}
        >
          <div
            className={cn(
              "size-[300px] absolute blur-2xl rounded-full transform-gpu"
            )}
            style={{
              background: "conic-gradient(#E85002, #C10801, #F16001)",
              animation: "spin 10s linear infinite",
            }}
          />
        </div>
        <div
          className="absolute top-0 left-0 grid place-items-center w-full h-full transform-gpu"
          style={{
            animation: "size-bounce 10s linear infinite",
          }}
        >
          <div
            className={cn(
              "size-[300px] absolute blur-2xl rounded-full opacity-80 transform-gpu  direction-reverse"
            )}
            style={{
              background: "conic-gradient(#E85002, #C10801, #F16001)",
              animation: "spin-left 15s linear infinite",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SoonPage;
