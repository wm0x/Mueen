"use client";

import React, { useEffect } from "react";
import { StripedPattern } from "./Striped";
import { StickyBanner } from "./sticky-msg";

interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}

const stats = [
  {
    label: "طلبات بانتظار المراجعة",
    count: 5,
    color: "border-4  border-white/40 bg-black/70",
  },
  {
    label: "طلبات قيد العمل عليها",
    count: 3,
    color: "border-4  border-white/40 bg-black/70",
  },
  {
    label: "طلبات معلقة",
    count: 2,
    color: "border-4 border-white/40 bg-black/70",
  },
  {
    label: "طلبات مكتملة",
    count: 8,
    color: "border-4  border-white/40 bg-black/70",
  },
];

function HomePage({ session }: { session: Session | null }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div>
      <StickyBanner className="absolute bg-gradient-to-b dark:from-teal-950 dark:to-black/5 from-teal-400/60 to-white/5">
        <p className="mx-0 max-w-[90%] dark:text-white text-gray-700 drop-shadow-md text-center">
          ✨ المنصّة لا زالت تحت التطوير حاليًا، اصبروا علينا شوي وراح نوفر
          تجربة أفضل
        </p>
      </StickyBanner>

      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
        <StripedPattern className="stroke-[0.3] [stroke-dasharray:8,4]" />

        <div className="z-10 flex flex-col items-center justify-center mb-10 md:mb-16">
          <div className="flex items-center" dir="rtl">
            <img
              src={"/mueen.png"}
              alt={"logo"}
              className="dark:invert w-20 h-20"
            />
            <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-50 tracking-wider">
              مُــــــعِــــــيــــــن
            </span>
          </div>
        </div>

        <div className="z-10 flex flex-col text-center items-center px-4">
          <h1 className="font-extrabold text-4xl sm:text-5xl text-gray-800 dark:text-gray-100">
            أهلاً وسهلاً بك يا {session?.user?.name || "user"}
          </h1>

          <p className="text-lg sm:text-xl mt-4 max-w-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            سعيدون بوجودك معنا. نحن هنا لمساعدتك في رحلتك التعليمية
          </p>


          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">

            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg ${stat.color} text-white`}
              >
                <span className="text-3xl font-bold">{stat.count}</span>
                <span className="mt-2 text-center text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
