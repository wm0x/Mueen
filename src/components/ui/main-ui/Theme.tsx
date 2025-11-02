"use client";

import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

export const ThemeSwitcherButton = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  // Helper function to handle the core theme change logic
  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle("dark");
    setTheme(dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    // this for check browser 
    if (document.startViewTransition) {
      await document.startViewTransition(() => {
        flushSync(toggleTheme);
      }).ready;
      
      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      
      const y = top + height / 2;
      const x = left + width / 2;

      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;
      
      const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRad}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } else {
      flushSync(toggleTheme);
    }
  };

  return (
    <button
      ref={buttonRef}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-neutral-500/10 bg-white px-2 py-1 font-medium text-neutral-600 tracking-tight hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      onClick={changeTheme}
      type="button"
    >
      <span className={cn("relative size-6 scale-75 rounded-full bg-linear-to-tr")}>
        <span
          className={cn(
            "absolute top-0 left-0 z-10 h-full w-full transform-gpu rounded-full bg-linear-to-tr from-indigo-400 to-sky-200 transition-all duration-500",
            theme === "dark" ? "scale-100" : "scale-90"
          )}
        />
        <span
          className={cn(
            "absolute top-0 left-0 z-10 h-full w-full transform-gpu rounded-full bg-linear-to-tr from-rose-400 to-amber-300 transition-all duration-500",
            theme === "light" ? "opacity-100" : "opacity-0"
          )}
        />
        <span
          className={cn(
            "absolute top-0 right-0 z-20 size-4 origin-top-right transform-gpu rounded-full bg-white transition-transform duration-500 group-hover:bg-neutral-100 dark:bg-neutral-800 dark:group-hover:bg-neutral-700",
            theme === "dark" ? "scale-100" : "scale-0"
          )}
        />
      </span>

      <span className="relative h-6 w-12">
        <span
          className={cn(
            "absolute top-0 left-0 transition-all duration-700",
            theme === "light"
              ? "-translate-y-4 opacity-0 blur-lg"
              : "translate-y-0 opacity-100 blur-0"
          )}
        >
          الداكن
        </span>
        <span
          className={cn(
            "absolute top-0 left-0 transition-all duration-700",
            theme === "dark"
              ? "translate-y-4 opacity-0 blur-lg"
              : "translate-y-0 opacity-100 blur-0"
          )}
        >
          النهاري
        </span>
      </span>
    </button>
  );
};

export default ThemeSwitcherButton;