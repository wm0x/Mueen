"use client"
import React, { useEffect } from "react";
import { ExpandableCardDemo } from "./expandable-card-demo-grid";

function HistoryMainForm() {
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
      <div className="">
        <ExpandableCardDemo />
      </div>
    </div>
  );
}

export default HistoryMainForm;
