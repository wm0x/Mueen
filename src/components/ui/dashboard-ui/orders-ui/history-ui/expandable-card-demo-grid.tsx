"use client";
import { useState, useEffect, useRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/click/useOutsideClick";
import Link from "next/link";
import {
  IoDocumentAttachOutline,
  IoEyeOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoHourglassOutline,
  IoClose,
  IoWalletOutline,
  IoChatbubbleEllipsesOutline,
  IoInformationCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

interface Card {
  id: string;
  title: string;
  description: string;
  status: "معلق" | "قيد المعالجة" | "بانتظار الدفع" | "مكتمل" | "مرفوض";
  createdAt: string;
  isAdminViewed: boolean;
  price: number | null;
  priceDetails: string | null;
  rejectionReason: string | null;
  files: { name: string; link: string }[];
}

// 📌 بيانات البطاقات التجريبية
const cards: Card[] = [
  {
    id: "ORD001",
    title: "طلب ترجمة مستعجلة للوثائق",
    description:
      "ترجمة معتمدة لشهادة جامعية وكشف درجات للتقديم على منحة دراسية في الخارج.",
    status: "بانتظار الدفع",
    createdAt: "2025-10-28T10:30:00Z",
    isAdminViewed: true,
    price: 450.75,
    priceDetails:
      "رسوم ترجمة الشهادة (250 ريال) + رسوم ترجمة الكشف (150 ريال) + رسوم خدمة مستعجلة (50.75 ريال).",
    rejectionReason: null,
    files: [
      { name: "University_Certificate.pdf", link: "#" },
      { name: "Transcript_Record.pdf", link: "#" },
    ],
  },
  {
    id: "ORD002",
    title: "طلب استشارة قانونية تجارية",
    description:
      "استشارة بخصوص صياغة عقد شراكة جديد بين طرفين في مجال التقنية المالية.",
    status: "مكتمل",
    createdAt: "2025-10-25T14:45:00Z",
    isAdminViewed: true,
    price: 0,
    priceDetails: null,
    rejectionReason: null,
    files: [{ name: "Draft_Partnership_Agreement.docx", link: "#" }],
  },
  {
    id: "ORD003",
    title: "طلب تصميم هوية بصرية جديدة",
    description:
      "تصميم شعار متكامل وكافة العناصر البصرية لشركة ناشئة متخصصة في الذكاء الاصطناعي.",
    status: "قيد المعالجة",
    createdAt: "2025-10-20T09:00:00Z",
    isAdminViewed: true,
    price: 1500,
    priceDetails: "تم دفع الدفعة الأولى. الدفعة النهائية: 1500 ريال.",
    rejectionReason: null,
    files: [{ name: "Brand_Brief.pdf", link: "#" }],
  },
  {
    id: "ORD004",
    title: "طلب تعديل ملف تعريفي",
    description:
      "تحديث ملف تعريف السيرة الذاتية ليتناسب مع متطلبات وظيفة مدير مشروع تقني.",
    status: "مرفوض",
    createdAt: "2025-10-18T11:20:00Z",
    isAdminViewed: true,
    price: null,
    priceDetails: null,
    rejectionReason:
      "الطلب خارج نطاق خدماتنا المتخصصة حاليًا. نعتذر عن عدم إمكانية التنفيذ.",
    files: [{ name: "Old_CV.pdf", link: "#" }],
  },
  {
    id: "ORD005",
    title: "طلب تحليل بيانات إحصائية",
    description:
      "تحليل مجموعة بيانات لدراسة أكاديمية حول تأثير وسائل التواصل الاجتماعي على الشباب.",
    status: "معلق",
    createdAt: "2025-10-15T16:00:00Z",
    isAdminViewed: false,
    price: 0,
    priceDetails: null,
    rejectionReason: null,
    files: [
      { name: "Raw_Data_Set.xlsx", link: "#" },
      { name: "Study_Protocol.pdf", link: "#" },
    ],
  },
];
// يمكنك تفريغ المصفوفة لجعل حالة عدم وجود طلبات تظهر
// const cards: Card[] = [];

// وظيفة لتنسيق التاريخ
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Date(dateString).toLocaleDateString("ar-SA", options);
};

// وظيفة لتنسيق السعر بالريال السعودي
const formatPrice = (price: number) => {
  return price.toLocaleString("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
  });
};

// دالة لتحديد لون الشارة
const getStatusColor = (status: Card["status"]) => {
  switch (status) {
    case "معلق":
      return "bg-amber-500/90";
    case "قيد المعالجة":
      return "bg-blue-500/90";
    case "بانتظار الدفع":
      return "bg-purple-600/90";
    case "مكتمل":
      return "bg-emerald-600/90";
    case "مرفوض":
      return "bg-red-600/90";
    default:
      // هذا الفرع لن يتم الوصول إليه غالبًا بسبب تعريف النوع
      return "bg-neutral-500/80";
  }
};

export function ExpandableCardDemo() {
  // 📌 تحديث نوع الـ state ليقبل إما Card، أو boolean، أو null
  const [active, setActive] = useState<Card | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }
    // 📌 فحص النوع قبل محاولة الوصول إلى خصائص البطاقة
    if (active && typeof active === "object")
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as any, () => setActive(null));

  // 📌 فحص النوع للحصول على البيانات النشطة
  const activeCard = active && typeof active === "object" ? active : null;

  // تحديد ما إذا كانت حالة الطلب "بانتظار الدفع" أو "مرفوض"
  const isPaymentPending =
    activeCard &&
    activeCard.status === "بانتظار الدفع" &&
    activeCard.price !== null; // يجب أن يكون السعر موجودًا

  const isRejected = activeCard && activeCard.status === "مرفوض";

  // 🚀 حالة عدم وجود طلبات
  const isEmpty = cards.length === 0;

  return (
    <div
      dir="rtl"
      className=" py-8 px-2 md:py-12 md:px-4 bg-gray-50 dark:bg-neutral-950 "
    >
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCard && (
          <div className="fixed inset-0 grid place-items-start md:place-items-center z-50 p-2 md:p-4 overflow-y-auto">
            <motion.div
              layoutId={`card-${activeCard.title}-${id}`}
              ref={ref}
              className="w-full max-w-3xl mt-4 md:mt-0 bg-white pb-10 dark:bg-neutral-900 rounded-[25px] md:rounded-[35px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-100/50 dark:border-neutral-800/80 overflow-y-auto max-h-[95vh]"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 dark:bg-black/50 text-gray-800 dark:text-white/80 hover:bg-white dark:hover:bg-black transition-colors backdrop-blur-sm shadow-lg"
              >
                <IoClose className="size-6" />
              </button>

              <div className="relative p-6 md:p-10 space-y-4 md:space-y-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-neutral-800/50 dark:to-neutral-900 pb-10 ">
                {/* Status Badge */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                  <span
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white font-semibold text-xs md:text-sm shadow-xl backdrop-blur-sm ${getStatusColor(
                      activeCard.status
                    )}`}
                  >
                    {activeCard.status}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
                  <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-neutral-800 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-gray-200 dark:border-neutral-700/50 ring-4 ring-indigo-100/50 dark:ring-neutral-700/50">
                    {activeCard.status === "مكتمل" ? (
                      <IoCheckmarkCircleOutline className="size-10 md:size-12 text-emerald-500 animate-pulse" />
                    ) : activeCard.status === "مرفوض" ? (
                      <IoCloseCircleOutline className="size-10 md:size-12 text-red-500" />
                    ) : (
                      <IoDocumentAttachOutline className="size-10 md:size-12 text-indigo-500 dark:text-indigo-400" />
                    )}
                  </div>

                  <div className="mt-4 md:mt-6 text-center">
                    <motion.h3
                      layoutId={`title-${activeCard.title}-${id}`}
                      className="font-extrabold text-xl md:text-3xl text-gray-900 dark:text-white mb-1 md:mb-2"
                    >
                      {activeCard.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${activeCard.description}-${id}`}
                      className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base max-w-lg mx-auto"
                    >
                      {activeCard.description}
                    </motion.p>
                  </div>
                </div>

                {/* Important Details Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100/80 dark:bg-neutral-800/80 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-200 dark:border-neutral-700/50 shadow-inner space-y-2 sm:space-y-0">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    <IoCalendarOutline className="size-4 md:size-5 text-indigo-500" />
                    <span className="font-semibold">
                      تاريخ الإنشاء: {formatDate(activeCard.createdAt)}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-xs md:text-sm font-medium ${
                      activeCard.isAdminViewed
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    <IoEyeOutline className="size-4 md:size-5" />
                    <span>
                      {activeCard.isAdminViewed
                        ? "تمت مراجعتها من قِبل المسؤولين"
                        : "لم يتم مراجعتها من قِبل المسؤولين بعد"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-4 md:space-y-8">
                {/* 🛑 Rejection Section */}
                {isRejected && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-50 dark:bg-red-900/20 rounded-2xl md:rounded-3xl p-5 border border-red-300 dark:border-red-700 shadow-xl shadow-red-500/10"
                  >
                    <div className="flex items-center gap-2 border-b border-red-300 dark:border-red-700 pb-3 mb-4">
                      <IoCloseCircleOutline className="size-6 md:size-7 text-red-700 dark:text-red-400" />
                      <h4 className="font-extrabold text-xl md:text-2xl text-red-800 dark:text-red-300">
                        تم رفض الطلب
                      </h4>
                    </div>

                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">
                      سبب الرفض:
                    </p>
                    <blockquote className="text-sm text-red-800 dark:text-red-300 bg-red-100/50 dark:bg-red-900/40 border-r-4 border-red-500 pr-3 py-2 rounded-lg">
                      {activeCard.rejectionReason || "لا يوجد سبب محدد للرفض."}
                    </blockquote>
                  </motion.div>
                )}

                {/* 💳 Payment Section */}
                {isPaymentPending && activeCard.price !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl md:rounded-3xl p-5 border border-neutral-300 dark:border-neutral-700 shadow-xl shadow-neutral-500/10"
                  >
                    <div className="flex flex-col gap-3 border-b border-neutral-300 dark:border-neutral-700 pb-4 mb-4">
                      {/* العنوان والسعر في صف واحد */}
                      <div className="flex items-center justify-between w-full">
                        <h4 className="font-extrabold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                          <IoWalletOutline className="size-6 text-neutral-600 dark:text-neutral-300" />
                          المبلغ المطلوب
                        </h4>
                        <span className="text-2xl font-black text-black dark:text-white">
                          {formatPrice(activeCard.price)}
                        </span>
                      </div>

                      {/* تفاصيل التسعير - دائماً مرئية على الموبايل */}
                      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300 ml-1">
                            تفاصيل التسعير:
                          </span>
                          {activeCard.priceDetails ||
                            "لا توجد تفاصيل تسعير محددة لهذا الطلب."}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      يرجى إتمام عملية الدفع للمتابعة في معالجة طلبك وتجنب أي
                      تأخير.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/payment/checkout?order=${activeCard.id}`}
                        className="group relative flex-1 bg-gradient-to-r from-neutral-800 to-black text-white text-center py-3 rounded-xl font-bold text-sm shadow-lg shadow-neutral-900/30 hover:shadow-neutral-900/50 transition-all duration-300"
                      >
                        <div className="relative flex items-center justify-center gap-2">
                          <IoWalletOutline className="size-5" />
                          <span> إتمام الدفع</span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {!isRejected && (
                  <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200 dark:border-neutral-700/50">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                      <IoDocumentAttachOutline className="size-4 md:size-5 text-indigo-500" />
                      الملفات المرفوعة ({activeCard.files.length})
                    </h4>
                    <div className="space-y-2">
                      {activeCard.files.map((file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg md:rounded-xl p-3 border border-gray-100 dark:border-neutral-700/50 shadow-sm"
                        >
                          <span className="text-gray-700 dark:text-gray-200 text-xs md:text-sm font-medium truncate max-w-[60%]">
                            <span className="text-indigo-500 ml-2">#</span>
                            {file.name}
                          </span>
                          <a
                            href={file.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm font-bold bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg"
                          >
                            <IoEyeOutline className="size-4" />
                            عرض الملف
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isRejected && (
                  <div className="pt-2 md:pt-4">
                    <Link
                      href={`/dashboard/orders/track?id=${activeCard.id}`}
                      className="group relative flex w-full bg-gradient-to-r from-neutral-800 to-black text-white text-center py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg 
                  shadow-xl shadow-neutral-900/50 hover:shadow-neutral-900/70 transition-all duration-500 overflow-hidden transform hover:scale-[1.01]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[120%] transition-transform duration-1000" />

                      <div className="relative flex items-center justify-center gap-2 w-full">
                        <span>تتبع حالة الطلب خطوة بخطوة</span>
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* if cards empty */}
      <div className="max-w-7xl mx-auto my-auto pb-10">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center   ">
            <p className="text-xl font-bold text-gray-700 dark:text-gray-100 mb-2">
              لا توجد طلبات لعرضها حالياً
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              عند تقديم طلب جديد، ستظهر حالته وتفاصيله هنا.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => setActive(card)}
                className="group relative transform-gpu overflow-hidden rounded-[25px] bg-white/10 p-2 transition-all duration-300 hover:shadow-2xl active:scale-[0.98] cursor-pointer border border-gray-200 dark:border-neutral-700 hover:border-indigo-400/50 dark:hover:border-indigo-600/50"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[25px]"
                  style={{
                    background:
                      "radial-gradient(circle at var(--x) var(--y), rgba(99, 102, 241, 0.4) 0%, transparent 40%)",
                  }}
                />

                <div className="absolute inset-px rounded-[23px] bg-gray-50 dark:bg-neutral-900 transition-colors duration-300" />

                <motion.div
                  layoutId={`card-${card.title}-${id}`}
                  className="relative rounded-[20px] bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 overflow-hidden h-full flex flex-col transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/10"
                >
                  <div className="flex items-center justify-between p-5 bg-gradient-to-b from-indigo-50/50 to-white dark:from-neutral-700/20 dark:to-neutral-800/50 border-b border-gray-100 dark:border-neutral-700">
                    <div className="w-12 h-12 bg-white dark:bg-neutral-900 rounded-xl shadow-md flex items-center justify-center ring-2 ring-indigo-500/20">
                      <IoDocumentAttachOutline className="size-6 text-indigo-500" />
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-md ${getStatusColor(
                        card.status
                      )}`}
                    >
                      {card.status}
                    </span>
                  </div>

                  <div className="p-5 flex-grow">
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-bold text-xl text-gray-900 dark:text-white mb-2 transition-colors"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4"
                    >
                      {card.description}
                    </motion.p>
                  </div>

                  <div className="p-5 pt-4 border-t border-gray-100 dark:border-neutral-700/50 space-y-3">
                    {card.status === "بانتظار الدفع" && card.price !== null && (
                      <div className="flex items-center justify-between text-sm font-extrabold text-purple-600 dark:text-purple-400">
                        <div className="flex items-center gap-1">
                          <IoWalletOutline className="size-4" />
                          <span>المبلغ:</span>
                        </div>
                        <span className="text-base">
                          {formatPrice(card.price)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <IoCalendarOutline className="size-4 text-indigo-400" />
                        <span>
                          {new Date(card.createdAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IoDocumentAttachOutline className="size-4 text-indigo-400" />
                        <span>{card.files.length} ملف</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-xs font-medium ${
                        card.isAdminViewed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {card.isAdminViewed ? (
                        <IoCheckmarkCircleOutline className="size-4" />
                      ) : (
                        <IoHourglassOutline className="size-4" />
                      )}
                      <span>
                        {card.isAdminViewed ? "مراجَع" : "قيد الانتظار"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
