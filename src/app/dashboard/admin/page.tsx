"use client";
import FollowCursorHideCursor from "@/hooks/mouse/mouse";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { MainMenusGradientCard } from "../../../components/ui/dashboard-ui/orders-ui/GradientCard";
import {
  BringToFront,
  EditIcon,
  HistoryIcon,
  MousePointer,
} from "lucide-react";
import { RiRefund2Fill, RiTimeLine } from "react-icons/ri";
import Link from "next/link";
import { PiQuestionMarkBold } from "react-icons/pi";
import {
  IoBagCheckOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa";

function OrdersPage() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return (
    <div className="min-h-screen">
      <div className=" flex  text-center items-center p-4 mb-10" dir="rtl">
        <img
          src={"/mueen.png"}
          alt={"logo"}
          width={95}
          height={95}
          className="dark:invert -mr-10 md:-mr-0"
        />
        <span className="text-5xl font-bold text-black dark:text-white ">
          مُــــــعِــــــيــــــن
        </span>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <AdvancedGradiant className="opacity-50" />
      </div>
      <div className="flex items-center justify-center w-full mb-6" dir="rtl">
        <div className="grid relative p-2 grid-cols-1 w-3/6 gap-12 md:grid-cols-2 mx-auto my-auto ">
          <Link href="/dashboard/admin/orders" className="w-full">
            <MainMenusGradientCard
              className="p-4 cursor-pointer relative"
              description="عرض جميع الطلبات المتاحة الان فالنظام "
              title="الطلبات "
            >
              <div className="flex items-center mx-auto my-auto p-4 bg-neutral-400/15 rounded-xl w-fit justify-center">
                <BringToFront className="size-6 text-neutral-400/80" />
              </div>
            </MainMenusGradientCard>
          </Link>

          <Link href="/dashboard/admin/accepted-orders" className=" ">
            <MainMenusGradientCard
              className="p-4 cursor-pointer"
              description="عرض الطلبات التي تم قبولها ومعالجتها من قبلك"
              title="الطلبات المقبولة"
            >
              <div className="flex items-center mx-auto my-auto p-4 gap-3 bg-neutral-400/15 rounded-xl w-fit justify-center">
                <FaRegThumbsUp className="size-6 text-neutral-400/80" />
              </div>
            </MainMenusGradientCard>
          </Link>
        </div>
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
                "conic-gradient(#FF0080, #EE00FF, #00A6FF, #4797FF, #0044FF, #FF8000, #FF00CC)",
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
              background: "conic-gradient(#FFF, #12B4E6, #DC4CFC)",
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
              background: "conic-gradient(#A6EFFF, #12ADE6, #4C63FC)",
              animation: "spin-left 15s linear infinite",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
