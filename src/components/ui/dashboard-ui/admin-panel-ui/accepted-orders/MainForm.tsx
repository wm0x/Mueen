"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHourglassOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoCalendarOutline,
  IoDocumentAttachOutline,
  IoPricetagOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTimeOutline,
  IoEyeOutline,
  IoDocumentOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { supabase } from "@/lib/supabase";
import { FileDropzone } from "./AdminUploade";
import { toast } from "sonner";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Order {
  id: string;
  title: string;
  description: string | null;
  status:
    | "معلق"
    | "قيد المعالجة"
    | "بانتظار الدفع"
    | "مكتمل"
    | "مرفوض"
    | "قيد التنفيذ"
    | string;
  filesUrls: string[];
  subject: string[];
  createdAt: string;
  deadline: string | null;
  acceptedByAdminId?: string | null;
  user?: UserDetails;
}

interface AdminOrderActionCardProps {
  order: Order;
  onOrderUpdated: (orderId: string, newStatus: string) => void;
  userRole: string;
  currentAdminId: string;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "غير محدد";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ar-SA", options);
};

const fetchAcceptedOrdersAPI = async (): Promise<Order[]> => {
  try {
    const res = await fetch("/api/orders/admin/get-admin-orders", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast.error("خطأ في جلب البيانات", {
        description: `خطأ في جلب البيانات من السيرفر ${errorData}`,
        action: {
          label: "تجاهل",
          onClick: () => console.log("Undo"),
        },
      });
    }

    const data = await res.json();
    return data.orders || [];
  } catch (error) {
    console.error("fetchAcceptedOrdersAPI Error:", error);
    throw error;
  }
};

const completeOrderAPI = async (
  orderId: string,
  finalFileUrl: string[],
  adminId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch("/api/orders/admin/complete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, finalFileUrl }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.error || `Server error: ${res.status}`,
      };
    }
    return { success: true };
  } catch (error) {
    console.error("Completion API Error:", error);
    return { success: false, error: "Server fetch error" };
  }
};

const AcceptedOrderRow: React.FC<{
  order: Order;
  onCompletion: (orderId: string, newStatus: string) => void;
  adminId: string;
}> = ({ order, onCompletion, adminId }) => {
  const isReadyForUpload =
    order.status === "قيد التنفيذ" || order.status === "قيد المعالجة";
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isCompleted = order.status === "مكتمل";
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const statusColor =
    order.status === "قيد التنفيذ" || order.status === "قيد المعالجة"
      ? "bg-orange-500"
      : order.status === "بانتظار الدفع"
      ? "bg-purple-600"
      : "bg-emerald-600";

  const handleComplete = async () => {
    if (files.length === 0) {
      toast.warning("قم بأختيار ملف اولا", {
        description: "قم بتحديد ملف اولا لرفع وتغير حالة الطلب",
        action: {
          label: "تجاهل",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const filePath = `solutions/${order.id}/${Date.now()}_${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("solutions")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`فشل رفع الملف ${file.name}: ${uploadError.message}`);
        }

        const { data: publicData } = supabase.storage
          .from("solutions")
          .getPublicUrl(filePath);

        if (!publicData?.publicUrl) {
          throw new Error(`فشل الحصول على رابط الملف: ${file.name}`);
        }

        uploadedUrls.push(publicData.publicUrl);
      }

      const result = await completeOrderAPI(order.id, uploadedUrls, adminId);

      if (result.success) {
        onCompletion(order.id, "مكتمل");
        toast.success("تحديث حالة الطلب", {
          description: `تم تحديث حالة الطلب #${order.id} إلى: مكتمل. تم رفع الملفات بنجاح.`,
          action: {
            label: "تجاهل",
            onClick: () => console.log("Undo"),
          },
        });
      } else {
        throw new Error(result.error || "فشل في الإكمال.");
      }
    } catch (e) {
      setUploadError(
        `حدث خطأ أثناء الرفع: ${
          e instanceof Error ? e.message : "خطأ غير معروف"
        }`
      );
      toast.error("خطأ غير معروف", {
        description: `فشل الإكمال: ${e instanceof Error ? e.message : "خطأ غير معروف"}`,
        action: {
          label: "تجاهل",
          onClick: () => console.log("Undo"),
        },
      });
    } finally {
      setIsUploading(false);
      setFiles([]);
    }
  };

  const acceptedByMe = order.acceptedByAdminId === adminId;

  const renderDetailsContent = () => (
    <div className="p-6 pt-4 text-sm text-gray-700 dark:text-gray-300 border-t border-neutral-200/60 dark:border-neutral-700/60 bg-neutral-50 dark:bg-neutral-800">
      <h4 className="font-bold mb-4 text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
        <div className="w-1 h-4 bg-neutral-500 rounded-full"></div>
        تفاصيل الطلب
      </h4>

      <div className="space-y-3">
        {order.user && (
          <div className="py-2 px-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-sm">
            <h5 className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              بيانات العميل:
            </h5>
            <p className="text-xs">الاسم: {order.user.name}</p>
            <p className="text-xs">البريد: {order.user.email}</p>
            <p className="text-xs">الهاتف: {order.user.phone || "غير متاح"}</p>
          </div>
        )}
        <div className="flex justify-between items-center py-2 px-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <span className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300">
            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
              <IoCalendarOutline className="size-3.5 text-neutral-500" />
            </div>
            تاريخ الإنشاء:
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatDate(order.createdAt)}
          </span>
        </div>
        {order.deadline && (
          <div className="flex justify-between items-center py-2 px-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <span className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300">
              <div className="p-1.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                <IoTimeOutline className="size-3.5 text-neutral-500" />
              </div>
              يجب التسليم قبل تاريخ:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatDate(order.deadline)}
            </span>
          </div>
        )}
        {order.subject.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-neutral-500 rounded-full"></div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                المواد:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.subject.map((sub, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700/50 text-xs font-medium text-neutral-700 dark:text-neutral-300 rounded-full shadow-sm"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}
        {order.filesUrls.length > 0 && (
          <div className="pt-3">
            <div className="flex items-center gap-2 mb-3 border-t pt-3 border-neutral-200 dark:border-neutral-700">
              <div className="w-1 h-4 bg-neutral-500 rounded-full"></div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                الملفات المرفوعة ({order.filesUrls.length})
              </span>
            </div>
            <div className="space-y-2">
              {order.filesUrls.map((url, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                      <IoDocumentOutline className="size-4 text-neutral-600 dark:text-neutral-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                      {url.split("/").pop() || `ملف ${i + 1}`}
                    </span>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors duration-200"
                  >
                    <IoEyeOutline className="size-3.5" />
                    عرض
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-2xl border overflow-hidden w-full text-right shadow-lg transition-all duration-300 backdrop-blur-sm",
        isHovered
          ? "border-neutral-400/50 bg-white dark:bg-neutral-900 hover:shadow-xl"
          : "border-neutral-200 bg-white dark:bg-neutral-900"
      )}
    >
      <div
        className={cn(
          "p-6 border-b dark:border-neutral-700/60 flex justify-between items-start transition-all duration-300",
          isHovered ? "bg-neutral-50 dark:bg-neutral-800/70" : "bg-transparent"
        )}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black text-gray-900 dark:text-white truncate leading-tight">
            {order.title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            رقم الطلب: {order.id}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={cn("p-2 rounded-xl", statusColor)}>
            {order.status === "مكتمل" ? (
              <IoCheckmarkCircleOutline className="size-5 text-white" />
            ) : (
              <IoHourglassOutline className="size-5 text-white" />
            )}
          </div>
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full text-white",
              statusColor
            )}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div
        onClick={() => setShowDetails(!showDetails)}
        className="flex justify-between items-center p-4 text-sm font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2">عرض التفاصيل الكاملة</div>
        <div className="p-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg transition-transform duration-200">
          {showDetails ? (
            <IoChevronUpOutline className="size-4 text-neutral-700 dark:text-neutral-300" />
          ) : (
            <IoChevronDownOutline className="size-4 text-neutral-700 dark:text-neutral-300" />
          )}
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {renderDetailsContent()}
        </motion.div>
      )}

      <div className="p-6">
        {isReadyForUpload && acceptedByMe && !isCompleted && (
          <div className="mt-2 w-full space-y-3 p-4 border border-orange-400/50 dark:border-orange-700/50 rounded-xl bg-orange-50 dark:bg-orange-900/10 shadow-inner">
            <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400">
              إنهاء الطلب ورفع الحل:
            </h4>

            <FileDropzone value={files} onChange={setFiles} />

            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}

            <button
              onClick={handleComplete}
              disabled={isUploading || files.length === 0}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm disabled:opacity-50 transition-colors shadow-md mt-2"
            >
              {isUploading
                ? "جاري الرفع والإكمال..."
                : "رفع وإنهاء الطلب (مكتمل)"}
            </button>
          </div>
        )}

        {isCompleted && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-300">
            تم إكمال الطلب بنجاح ✅
          </p>
        )}
        {order.status === "بانتظار الدفع" && acceptedByMe && (
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-300">
            هذا الطلب في انتظار إتمام العميل للدفع لبدء العمل.
          </p>
        )}

        {!acceptedByMe && !isCompleted && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg border border-neutral-300">
            الطلب قيد المعالجة، لكنه مقبول بواسطة مسؤول آخر.
          </p>
        )}
      </div>
    </motion.div>
  );
};


interface DemoProps {
  initialAdminId: string;
  initialRole: string;
}

export const AdminOrderActionCardDemo: React.FC<DemoProps> = ({
  initialAdminId,
  initialRole,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentRole = initialRole;
  const currentAdminId = initialAdminId;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAcceptedOrdersAPI();

      const filteredOrders = data.filter(
        (order) => order.status !== "مرفوض" && order.status !== "معلق"
      );

      setOrders(filteredOrders);
    } catch (err) {
      console.error("Fetch Error:", err);
      const errorMessage =
        err instanceof Error && err.message.includes("غير مصرح")
          ? "يرجى تسجيل الدخول بحساب مسؤول لعرض الطلبات."
          : "فشل في جلب الطلبات المقبولة من السيرفر.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdminId && currentAdminId !== "UNAUTHED_USER") {
      fetchOrders();
    }
  }, [currentAdminId]);

  const handleCompletion = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="col-span-full text-center p-10 rounded-xl">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            جاري تحميل الطلبات المقبولة...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center p-10 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-300">
          <p className="text-lg text-red-700 dark:text-red-300 font-bold">
            خطأ في الاتصال:
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="col-span-full">
          <div className="text-center p-12 ">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-orange-500 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  لم تقوم بقبول اي طلب حتى الان !
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                  ما حصلنا لك اي طلب فالنظام حاول تقبل طلبات باسرع وقت
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return orders.map((order) => (
      <AcceptedOrderRow
        key={order.id}
        order={order}
        onCompletion={handleCompletion}
        adminId={currentAdminId}
      />
    ));
  };

  return (
    <div dir="rtl" className="  p-6 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              إدارة الطلبات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {orders.length > 0
                ? `عرض ${orders.length} طلب${orders.length > 1 ? "ات" : ""}`
                : "إدارة طلبات العملاء"}
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-6 cursor-pointer py-3 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200 font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            تحديث
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
        {renderContent()}
      </div>
    </div>
  );
};
