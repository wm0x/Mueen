import React from "react";
import { Highlighter } from "./highlighter";
import { NumberTicker } from "./number-ticker";

function Statistics() {
  return (
    <div
      className="relative flex w-full flex-col justify-center overflow-hidden min-h-screen translate-y-2 bg-transparent shadow-[inset_0_12px_12px_-8px_rgba(0,0,0,0.1),inset_0_-12px_12px_-8px_rgba(0,0,0,0.1)] dark:bg-neutral-950 dark:shadow-[inset_0_12px_12px_-8px_rgba(255,255,255,0.1),inset_0_-12px_12px_-8px_rgba(255,255,255,0.1)]"
      dir="rtl"
    >
      <div className="flex flex-col items-center justify-center px-4 space-y-6">
        <p className="leading-relaxed text-4xl text-center font-black">
          احصائيات منصة{" "}
          <Highlighter action="highlight" color="#22c55e">
            مُــــــعِــــــيــــــن
          </Highlighter>
        </p>

        <p className="text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
          تُظهر هذه الإحصائيات مدى تأثير منصة مُــــــعِــــــيــــــن في مساعدة
          الطلاب في المشاريع و المواد الدراسية الخ.
        </p>
      </div>
      <div className="max-w-5xl border-2 mx-auto p-8 mt-20 border-green-500 rounded-4xl shadow-2xl bg-neutral-400/10 mb-10">
        <h1 className="text-2xl font-extrabold text-center mt-10 mb-20">
          المشاريع التي تم انجازها
        </h1>
        <div className=" flex flex-col mb-10 items-center md:flex-row gap-22 justify-center">
          <div className=" text-center">
            <h1 className="text-center text-2xl">مشاريع تخرج</h1>
            <NumberTicker
              value={4}
              className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white "
            />
          </div>
          <div>
            <h1 className="text-center text-2xl"> واجبات</h1>
            <NumberTicker
              value={47}
              className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
            />
          </div>
          <div>
            <h1 className="text-center text-2xl"> عروض تقدييه</h1>
            <NumberTicker
              value={12}
              className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
