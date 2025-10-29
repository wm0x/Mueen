"use client";
import { useState, useEffect, useRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/click/useOutsideClick";
import Link from "next/link";
import { IoDocumentAttachOutline } from "react-icons/io5";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }
    if (active && typeof active === "object")
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as any, () => setActive(null));

  return (
    <div dir="rtl" className=" py-8 px-4">
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="relative  p-8">
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-900">
                  <IoDocumentAttachOutline className="size-10 text-gray-500 dark:text-neutral-700" />
                </div>

                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-white font-semibold text-sm shadow-lg ${
                      active.status === "معلق"
                        ? "bg-amber-500"
                        : active.status === "قيد المعالجة"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  >
                    {active.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <motion.h3
                    layoutId={`title-${active.title}-${id}`}
                    className="font-bold text-2xl text-gray-900 dark:text-white mb-2"
                  >
                    {active.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${active.description}-${id}`}
                    className="text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    {active.description}
                  </motion.p>
                </div>

                <div className="bg-gray-100 dark:bg-neutral-700 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    الملفات المرفوعة
                  </h4>
                  <div className="space-y-2">
                    {active.files.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white dark:bg-neutral-600 rounded-xl p-3"
                      >
                        <span className="text-gray-700 dark:text-gray-200 text-sm truncate">
                          {file.name}
                        </span>
                        <a
                          href={file.link}
                          target="_blank"
                          className="text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium"
                        >
                          عرض الملف
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link
                    href={`/dashboard/orders/track?id=${active.id}`}
                    className="group relative flex-1 bg-gradient-to-l from-emerald-500 to-emerald-600 text-white text-center py-3.5 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Animated Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    {/* Button Content */}
                    <div className="relative flex items-center justify-center gap-2">
                      <span>تتبع الطلب</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => setActive(card)}
              className="group relative transform-gpu overflow-hidden rounded-[20px] bg-white/10 p-2 transition-all  active:scale-95 cursor-pointer border border-gray-200 dark:border-neutral-700"
            >
              {/* Gradient Effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, #3BC4F2, #7A69F9, #F26378, #F5833F)",
                  maskImage: `radial-gradient(100px circle at var(--x) var(--y), white, transparent)`,
                }}
              />

              <div className="absolute inset-px rounded-[19px] bg-neutral-100 dark:bg-neutral-900" />

              {/* Content */}
              <div className="relative rounded-[15px] bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 overflow-hidden">
                {/* Icon Container */}
                <div className="flex items-center justify-center p-8 bg-black/50 rounded-2xl ">
                  <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-xl shadow-sm   flex items-center justify-center">
                    <IoDocumentAttachOutline className="size-8 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2  transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
                    {card.description}
                  </p>

                  {/* Status & Files */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          card.status === "معلق"
                            ? "bg-amber-400"
                            : card.status === "قيد المعالجة"
                            ? "bg-blue-400"
                            : "bg-emerald-400"
                        }`}
                      ></span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {card.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {card.files.length} ملف
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dummy Data
const cards = [
  {
    id: 1,
    title: "طلب الطالب أحمد علي",
    description: "طلب جديد لتقديم المستندات الخاصة بالتسجيل.",
    src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=600&h=400",
    status: "معلق",
    files: [
      { name: "صورة الهوية.pdf", link: "#" },
      { name: "كشف درجات.pdf", link: "#" },
    ],
  },
  {
    id: 2,
    title: "طلب الطالب فاطمة محمد",
    description: "تقديم طلب اعتراض على نتائج الدورة السابقة.",
    src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=600&h=400",
    status: "قيد المعالجة",
    files: [
      { name: "صورة الهوية.pdf", link: "#" },
      { name: "اعتراض.pdf", link: "#" },
    ],
  },
  {
    id: 3,
    title: "طلب الطالب خالد يوسف",
    description: "طلب استرداد مبلغ رسوم الدورة التدريبية.",
    status: "مكتمل",
    files: [
      { name: "إيصال الدفع.pdf", link: "#" },
      { name: "طلب الاسترداد.pdf", link: "#" },
    ],
  },
];
