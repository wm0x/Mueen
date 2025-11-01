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

// --- INTERFACES ---

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

// 💡 دالة جلب الطلبات المقبولة للمسؤول الحالي (تستخدم API السيرفر)
const fetchAcceptedOrdersAPI = async (): Promise<Order[]> => {
  try {
    // 🚀 استدعاء API Route الحقيقي لجلب الطلبات المقبولة للمسؤول الحالي
    const res = await fetch("/api/orders/admin/get-admin-orders", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      // إذا فشل الـ API (بسبب عدم المصادقة مثلاً)، نطرح خطأ
      const errorText = await res.json();
      throw new Error(errorText.error || `فشل في جلب الطلبات: ${res.status}`);
    }

    const data = await res.json();
    // ⚠️ نتوقع أن API يعيد الكائن { orders: [...] }
    return data.orders || [];
  } catch (error) {
    console.error("fetchAcceptedOrdersAPI Error:", error);
    // في حالة وجود خطأ في الاتصال أو السيرفر، نعيد مصفوفة فارغة ونترك معالج الخطأ في Demo يعرض الرسالة
    throw error;
  }
};

// 💡 دالة لإنهاء الطلب (مكتمل) - تتصل بمسار API الحقيقي
const completeOrderAPI = async (
  orderId: string,
  finalFileUrl: string,
  adminId: string
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch("/api/orders/admin/complete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, finalFileUrl }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Completion API Error:", error);
    throw error;
  }
};

// --- AcceptedOrderRow Component (لعرض الطلبات المقبولة) ---

const AcceptedOrderRow: React.FC<{
  order: Order;
  onCompletion: (orderId: string, newStatus: string) => void;
  adminId: string;
}> = ({ order, onCompletion, adminId }) => {
  const isReadyForUpload = order.status === "جاري العمل عليه";
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // 💡 حالة الملف
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isCompleted = order.status === "مكتمل";
  const [showDetails, setShowDetails] = useState(false); // 💡 حالة عرض التفاصيل
  const [isHovered, setIsHovered] = useState(false); // 💡 حالة التمرير

  const statusColor =
    order.status === "جاري العمل عليه"
      ? "bg-orange-500"
      : order.status === "بانتظار الدفع"
      ? "bg-purple-600"
      : "bg-emerald-600";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleComplete = async () => {
    if (!file) {
      alert("يرجى اختيار ملف الحل النهائي أولاً.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    let finalFileUrl = "";

    try {
      // 1. محاكاة رفع الملف إلى Supabase Storage
      // ⚠️ هنا يجب استبدال المحاكاة برفع ملف حقيقي باستخدام Supabase
      await new Promise((r) => setTimeout(r, 1000));
      finalFileUrl = `https://yourdomain.supabase.co/storage/v1/object/public/orders/${order.id}/${file.name}`;

      // 2. استدعاء API السيرفر بالرابط النهائي
      const result = await completeOrderAPI(order.id, finalFileUrl, adminId);

      if (result.success) {
        onCompletion(order.id, "مكتمل");
        alert(
          `تم تحديث حالة الطلب #${order.id} إلى: مكتمل. تم رفع الملف بنجاح.`
        );
      } else {
      }
    } catch (e) {
      setUploadError(
        `حدث خطأ أثناء الرفع: ${
          e instanceof Error ? e.message : "خطأ غير معروف"
        }`
      );
    } finally {
      setIsUploading(false);
      setFile(null);
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
      {/* Header: Title and Status */}
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

      {/* Collapsible Details Toggle */}
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

      {/* Collapsible Details Content */}
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

      {/* Content / Action Area (Upload / Pending Payment / Completed) */}
      <div className="p-6">
        {isReadyForUpload && acceptedByMe && !isCompleted && (
          <div className="mt-2 w-full space-y-3 p-4 border border-orange-400/50 dark:border-orange-700/50 rounded-xl bg-orange-50 dark:bg-orange-900/10 shadow-inner">
            <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400">
              إنهاء الطلب ورفع الحل:
            </h4>

            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {file
                ? `الملف المختار: ${file.name}`
                : "اختر ملف الحل النهائي (.zip, .pdf, etc.)"}
            </label>
            {/* 💡 حقل اختيار الملف */}
            <Input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full p-2 border border-orange-400 dark:border-orange-700 rounded-lg text-sm bg-white dark:bg-neutral-900 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
            />

            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}

            <button
              onClick={handleComplete}
              disabled={isUploading || !file}
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

        {/* Fallback for others' accepted orders */}
        {!acceptedByMe && !isCompleted && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg border border-neutral-300">
            الطلب قيد المعالجة، لكنه مقبول بواسطة مسؤول آخر.
          </p>
        )}
      </div>
    </motion.div>
  );
};

// --- DEMO WRAPPER FOR ACCEPTED ORDERS ---

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

  // 💡 جلب الطلبات المقبولة (بدلاً من المعلقة)
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // 🚀 استخدام دالة جلب الطلبات المقبولة الحقيقية
      // (تم إزالة تمرير adminId لأن السيرفر يجلبه من الجلسة)
      const data = await fetchAcceptedOrdersAPI();

      // ⚠️ التصفية هنا ضرورية لضمان توافق العرض مع منطق صفحة المسؤول
      const filteredOrders = data.filter(
        (order) =>
          (order.acceptedByAdminId === currentAdminId &&
            (order.status === "بانتظار الدفع" ||
              order.status === "جاري العمل عليه")) ||
          order.status === "مكتمل"
      );

      setOrders(filteredOrders);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("فشل في جلب الطلبات المقبولة من السيرفر.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 💡 يتم الجلب عند التحميل الأولي
    if (currentAdminId && currentAdminId !== "UNAUTHED_USER") {
      fetchOrders();
    }
  }, [currentAdminId]);

  const handleCompletion = (orderId: string, newStatus: string) => {
    // عند إكمال الطلب، نقوم بتحديث حالته في الواجهة
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
