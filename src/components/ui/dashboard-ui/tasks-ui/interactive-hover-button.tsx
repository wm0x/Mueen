"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BiArrowFromRight } from "react-icons/bi";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-1.5 px-6 text-center font-semibold ",
        className
      )}
      dir="ltr"
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8] bg-teal-600" />
        <span
          className={cn(
            "inline-block transition-all duration-300 group-hover:opacity-0 text-black dark:text-white group-hover:-translate-x-12"
          )}
        >
          {children}
        </span>
      </div>
      <div
        className={cn(
          "absolute top-0 z-10 flex h-full w-full items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-100"
        )}
      >
        <span>{children}</span>
        <BiArrowFromRight className="text-white" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
