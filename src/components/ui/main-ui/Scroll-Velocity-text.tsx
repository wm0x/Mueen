"use client";
import { cn } from "@/lib/utils";
import { ScrollVelocityContainer, ScrollVelocityRow } from "./scroll-velocity";

const TEXT_ROW_A = [
  "برمجة ١",
  "برمجة ٢",
  "برمجة ٣",
  "خوارزميات وتعقيد",
  "رسومات حاسب",
  "هندسة برمجيات",
  "ذكاء اصطناعي",
  "البرمجة فالذكاء الاصطناعي",
  "التعلم العميق",
  "تعلم الاله",
  "برمجة محرك اللعبه",
  "نظم معلومات",
];

const TEXT_ROW_B = [
  "شبكات حاسب",
  "قواعد بيانات",
  "تحليل وتصميم كينوني ",
  "ادارة وتنظيم شبكات",
  "امن حاسب",
  "امن معلومات",
  "وسائط متعدده",
  "معمارية النظم",
];

export function ScrollBasedVelocityTextDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden ">
      <h1 className="flex items-center text-center justify-center sm:text-2xl md:text-3xl lg:text-4xl opacity-40 mb-8">
        المواد التي نقدم لك فيها المساعدة{" "}
      </h1>
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-6">
          {TEXT_ROW_A.map((text, idx) => (
            <div
              key={idx}
              className={cn(
                "mx-4 inline-flex items-center justify-center",
                "px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500/10 to-teal-500/10",
                "border border-teal-200/30 dark:border-teal-700/30",
                "text-lg font-semibold text-teal-700 dark:text-teal-300",
                "shadow-sm hover:shadow-md transition-all duration-300",
                " hover:from-teal-500/20 hover:to-cyan-500/20"
              )}
            >
              {text}
            </div>
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-6">
          {TEXT_ROW_B.map((text, idx) => (
            <div
              key={idx}
              className={cn(
                "mx-4 inline-flex items-center justify-center",
                "px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10",
                "border border-green-200/30 dark:border-green-700/30",
                "text-lg font-semibold text-green-700 dark:text-green-300",
                "shadow-sm hover:shadow-md transition-all duration-300",
                " hover:from-green-500/20 hover:to-emerald-500/20"
              )}
            >
              {text}
            </div>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#f7f7f7] to-transparent dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#f7f7f7] to-transparent dark:from-background"></div>
    </div>
  );
}
