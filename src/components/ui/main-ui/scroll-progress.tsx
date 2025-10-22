"use client";

import React, { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  title?: string;
  height?: number;
  children?: React.ReactNode;
}

export default function ProgressCard({
  className = " ",
  title = " ",
  height = 44,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const updatePageScroll = () => {
      const percentage =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollPercentage(percentage);
    };

    window.addEventListener("scroll", updatePageScroll);
    updatePageScroll();

    return () => {
      window.removeEventListener("scroll", updatePageScroll);
    };
  }, []);

  const borderRadius = `${height / 2}px`;

  // circle config
  const size = 28; 
  const stroke = 3; 
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - scrollPercentage * circumference;

  return (
    <MotionConfig
      transition={{
        duration: 0.7,
        type: "spring",
        bounce: 0.5,
      }}
    >
      <div
        className={cn(
            "fixed bottom-12 left-12 z-[999] bg-transparent backdrop-blur-lg rounded-xl shadow-lg ",
          className
        )}
        style={{ borderRadius }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <motion.div
          layout
          initial={{ height, width: 0 }}
          animate={{
            height: open && children ? "auto" : height,
            width: open && children ? 220 : 120,
          }}
          className="bg-neutral-900/40 dark:bg-neutral-100/40 dark:text-white relative cursor-pointer overflow-hidden text-secondary rounded-full"
        >
          <header className="flex h-11 cursor-pointer items-center gap-2 px-4">
            <svg
              className="w-7 h-7 rotate-[-90deg]"
              width={size}
              height={size}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#008080"
                strokeWidth={stroke}
                fill="transparent"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="white"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            <h1 className="grow text-center font-bold">{title}</h1>
            <span>{Math.round(scrollPercentage * 100)}%</span>
          </header>

          {children && open && (
            <motion.div className="mb-2 flex h-full max-h-60 flex-col gap-1 overflow-y-auto px-4 text-sm  ">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
