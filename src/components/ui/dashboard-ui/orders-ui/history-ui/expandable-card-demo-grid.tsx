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
  IoCloseCircleOutline,
  IoTrashOutline,
  IoPricetagOutline,
  IoRocketOutline,
  IoTimeOutline,
} from "react-icons/io5";

interface TrackingEvent {
  event: string;
  description: string | null;
  createdAt: string;
}

interface Card {
  id: string;
  title: string;
  description: string;
  status: // | "معلق"
  | "قيد المعالجة"
    | "بانتظار الدفع"
    | "قيد التنفيذ"
    | "مكتمل"
    | "مرفوض"
    | "جاري العمل عليه";
  createdAt: string;
  isAdminViewed: boolean;
  price: number | null;
  priceDetails: string | null;
  rejectionReason: string | null;
  files: { name: string; link: string }[];
  deadline: string | null;
  subject: string[];
  trackingLog: TrackingEvent[];
}

const cards: Card[] = [];

// Hijri date
const formatDate = (dateString: string | null) => {
  if (!dateString) return "غير محدد";
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

// تنسيق تاريخ ووقت التتبع
const formatTrackingDate = (dateString: string) => {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart}، ${timePart}`;
};

const formatPrice = (price: number) => {
  return price.toLocaleString("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
  });
};

const getStatusColor = (status: Card["status"]) => {
  switch (status) {
    // case "معلق":
    //   return "bg-amber-500/90";
    case "قيد المعالجة":
      return "bg-blue-500/90";
    case "قيد التنفيذ":
      return "bg-orange-500/90";
    case "بانتظار الدفع":
      return "bg-purple-600/90";
    case "مكتمل":
      return "bg-emerald-600/90";
    case "مرفوض":
      return "bg-red-600/90";
    default:
      return "bg-neutral-500/80";
  }
};

export function ExpandableCardDemo() {
  const [active, setActive] = useState<Card | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // 💡 NEW FUNCTION: Handle Delete
  const handleDelete = async () => {
    const activeCard = active as Card;
    if (!activeCard) return;

    if (
      !window.confirm(
        "هل أنت متأكد من أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/delete-order`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: activeCard.id }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCards((prev) => prev.filter((card) => card.id !== activeCard.id));
        setActive(null);
        alert(data.success || "تم حذف الطلب بنجاح.");
      } else {
        alert(`فشل في حذف الطلب: ${data.error || "حدث خطأ غير معروف"}`);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("حدث خطأ أثناء الاتصال بالخادم لحذف الطلب.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/get-orders");

        if (!res.ok) {
          console.log("API Response:", await res.text());
          return;
        }

        const data = await res.json();

        const mapped = data.map((o: any) => ({
          id: o.id,
          title: o.title,
          description: o.description,
          status: o.status,
          createdAt: o.createdAt,
          isAdminViewed: o.isAdminViewed,
          price: o.price,
          priceDetails: o.priceDetails,
          rejectionReason: o.rejectionReason,
          files:
            o.filesUrls?.map((url: string) => ({
              name: url.split("/").pop(),
              link: url,
            })) ?? [],
          deadline: o.deadline || null,
          subject: o.subject || [],
          trackingLog:
            o.orderTracking?.map((t: any) => ({
              event: t.event,
              description: t.description || null,
              createdAt: t.createdAt,
            })) || [],
        }));

        setCards(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const activeCard = active && typeof active === "object" ? active : null;

  const isPaymentPending =
    activeCard &&
    activeCard.status === "بانتظار الدفع" &&
    activeCard.price !== null;

  const isRejected = activeCard && activeCard.status === "مرفوض";

  const isEmpty = cards.length === 0;

  return (
    <div dir="rtl" className=" py-8 px-2 md:py-12 md:px-4  ">
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
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                  <span
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-white font-semibold text-xs md:text-sm shadow-xl backdrop-blur-sm ${getStatusColor(
                      activeCard.status
                    )}`}
                  >
                    {activeCard.status}
                  </span>
                </div>

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

                {(activeCard.deadline || activeCard.subject.length > 0) && (
                  <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200 dark:border-neutral-700/50 space-y-4">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <IoHourglassOutline className="size-4 md:size-5 text-indigo-500" />
                      تفاصيل الطلب الأساسية
                    </h4>

                    {activeCard.deadline && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-neutral-700/50 last:border-b-0">
                        <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <IoCalendarOutline className="size-4 text-orange-500" />
                          تاريخ التسليم النهائي:
                        </span>
                        <span className="font-extrabold text-sm md:text-base text-black dark:text-white">
                          {formatDate(activeCard.deadline)}
                        </span>
                      </div>
                    )}

                    {activeCard.subject.length > 0 && (
                      <div className="pt-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">
                          المواد:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeCard.subject.map((sub, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeCard.trackingLog.length > 0 && (
                  <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200 dark:border-neutral-700/50 space-y-4">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2 border-b pb-2">
                      <IoTimeOutline className="size-5 text-orange-500" />
                      سجل تحديثات الطلب ({activeCard.trackingLog.length})
                    </h4>

                    <div className="relative border-r-2 border-blue-200 dark:border-neutral-700 pr-4 space-y-6">
                      {/** here sort the tracking of order */}
                      {activeCard.trackingLog
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((log, index) => (
                          <div key={index} className="relative">
                            <span className="absolute top-1 -right-5.5 w-3 h-3 bg-orange-500 dark:bg-[#E85002] rounded-full ring-4 ring-blue-500/20 dark:ring-neutral-400/20" />
                            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                              {log.event}
                            </p>
                            {log.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {log.description}
                              </p>
                            )}
                            <time className="text-xs text-gray-400 dark:text-gray-500 block">
                              {formatTrackingDate(log.createdAt)}
                            </time>
                          </div>
                        ))}
                    </div>
                    {activeCard.trackingLog.length === 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        تم إنشاء الطلب في:{" "}
                        {formatTrackingDate(activeCard.createdAt)}
                      </div>
                    )}
                  </div>
                )}

                {isPaymentPending && activeCard.price !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl md:rounded-3xl p-5 border border-neutral-300 dark:border-neutral-700 shadow-xl shadow-neutral-500/10"
                  >
                    <div className="flex flex-col gap-3 border-b border-neutral-300 dark:border-neutral-700 pb-4 mb-4">
                      <div className="flex items-center justify-between w-full">
                        <h4 className="font-extrabold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                          <IoWalletOutline className="size-6 text-neutral-600 dark:text-neutral-300" />
                          المبلغ المطلوب
                        </h4>
                        <span className="text-2xl font-black text-black dark:text-white">
                          {formatPrice(activeCard.price)}
                        </span>
                      </div>

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
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              "/api/payment/order/pay-order",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  orderId: activeCard.id,
                                }),
                              }
                            );

                            const data = await res.json();

                            if (data.error) {
                              return alert(data.error);
                            }

                            // here i will add toast notification
                            window.location.reload();
                          } catch (err) {
                            console.error(err);
                            alert("حدث خطأ أثناء إتمام الدفع");
                          }
                        }}
                        className="group relative hover:cursor-pointer flex-1 bg-gradient-to-r from-stone-700 via-neutral-800 to-stone-900 text-white text-center py-3 rounded-xl font-bold text-sm shadow-lg shadow-stone-800/40 hover:shadow-stone-900/60 transition-all duration-300 transform border border-stone-600/30"
                      >
                        <div className="relative flex items-center justify-center gap-2">
                          <IoWalletOutline className="size-5" />
                          <span>إتمام الدفع</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeCard.price !== null && !isPaymentPending && (
                  <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-gray-200 dark:border-neutral-700/50 space-y-3">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 dark:text-white flex items-center gap-2 border-b pb-2">
                      <IoPricetagOutline className="size-4 md:size-5 text-emerald-600" />
                      تفاصيل التسعير
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-700 dark:text-gray-300">
                      تكلفة الطلب:
                      </span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatPrice(activeCard.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 pt-2 border-t border-gray-100 dark:border-neutral-700/50">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300 ml-1">
                        سبب التسعير:
                      </span>
                      {activeCard.priceDetails ||
                        "لا توجد تفاصيل تسعير إضافية."}
                    </p>
                  </div>
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

                {(activeCard.status === "قيد المعالجة" ||
                  activeCard.status === "بانتظار الدفع") && (
                  <div className="pt-4 md:pt-6">
                    <button
                      onClick={handleDelete}
                      className="group relative flex w-full justify-center items-center gap-2 bg-red-500/5 backdrop-blur-sm border border-red-600/70 dark:text-white text-center py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg 
      hover:border-red-500 transition-all duration-300 hover:bg-red-500/5 cursor-pointer"
                    >
                      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-red-500/0 group-hover:bg-red-500/5 transition-all duration-300"></div>

                      <IoTrashOutline className="size-5 md:size-6 text-red-500 relative z-10" />
                      <span className="relative z-10">حذف الطلب</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto my-auto pb-10">
        {loading ? (
          <div className="w-full text-center justify-center">
            <p>جاري التحميل...</p>
          </div>
        ) : isEmpty ? (
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

                    {card.deadline && (
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <IoCalendarOutline className="size-4 text-orange-500" />
                          <span>التسليم:</span>
                        </div>
                        <span className="font-medium">
                          {new Date(card.deadline).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    )}

                    {card.trackingLog && card.trackingLog.length > 0 && (
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                          <IoTimeOutline className="size-4" />
                          <span>آخر تحديث:</span>
                        </div>
                        <span className="font-medium text-blue-500 dark:text-blue-400">
                          {formatDate(card.trackingLog[0]?.createdAt)}
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
                        {card.isAdminViewed
                          ? "تمت المراجعه"
                          : "في انتظار المراجعة "}
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
