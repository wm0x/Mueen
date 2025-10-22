"use client";
import React, { useMemo } from "react";
import { DotPattern } from "./dot-pattern";
import { cn } from "@/lib/utils";
import FuzzyText from "./FuzzyText";
import { IoIosArrowBack } from "react-icons/io";
import FadeContent from "./FadeContent";
import { TextFade } from "./AnimatedContent";
import { HoverBorderGradient } from "./hover-border-gradient";

function Hero() {
  const dotPattern = useMemo(
    () => (
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_top,white,transparent)]",
          "dark:[mask-image:radial-gradient(900px_circle_at_top,white,transparent)]",
          " "
        )}
      />
    ),
    []
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden  ">
      {dotPattern}
      {/* Animated gradient overlay */}
      <div className="relative z-10 mx-auto my-auto flex max-w-5xl flex-col items-center justify-center space-y-8 px-6 text-center">
        {/* زر قصير مع أيقونة */}
        <FadeContent
          blur={false}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
          delay={50}
          className="-translate-y-10"
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="flex items-center space-x-2 bg-neutral-200 text-black dark:bg-neutral-900 dark:text-white cursor-pointer px-4 py-2 font-medium"
          >
            <IoIosArrowBack className="inline-block text-xl" />
            🚀 ننجز واجباتك ومشاريعك بتميز
          </HoverBorderGradient>
        </FadeContent>

        <FadeContent
          blur={false}
          duration={2000}
          easing="ease-out"
          initialOpacity={0}
          delay={200}
        >
          <div className="text-7xl font-extrabold tracking-wide">
            <FuzzyText baseIntensity={0.05}>
              مُــــــعِــــــيـــــــن
            </FuzzyText>
          </div>
        </FadeContent>

        <TextFade
          direction="up"
          className="pt-0 pb-5 flex-col flex justify-center items-center space-y-0"
        >
          <div className="space-y-6">
            <p className="max-w-3xl text-lg font-medium text-neutral-700 dark:text-neutral-300 md:text-xl leading-relaxed">
              نخبة النخبه من طلاب كلية الحاسبات و تقنية المعلومات نجتمع في هذي المنصه لنقدم الدعم واالمساعده لطلاب الكليه -  نساعدك في حل الواجبات و تنفيذ المشاريع و العروض التقديميه 
            </p>
          </div>
        </TextFade>
      </div>
    </div>
  );
}

export default Hero;
