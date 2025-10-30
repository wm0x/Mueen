"use client";
import React, { useEffect, useState } from "react";
import { ExpandableCardDemo } from "./expandable-card-demo-grid";

function HistoryMainForm() {
  const [activeFilter, setActiveFilter] = useState("الكل");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const filters = [
    { id: "all", label: "الكل", count: 12 },
    { id: "pending", label: "قيد المراجعة", count: 3 },
    { id: "completed", label: "مكتملة", count: 7 },
    { id: "cancelled", label: "ملغاة", count: 2 },
  ];
  return (
    <div>
      <div
        className=" flex justify-between text-center items-center  p-4 mb-10 border-b"
        dir="rtl"
      >
        <div className="flex text-center items-center ">
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

        <div className=" text-2xl md:text-4xl "> طلباتك</div>
      </div>

      <div className="">
        <ExpandableCardDemo />
      </div>
    </div>
  );
}

export default HistoryMainForm;
