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
import { Input } from "../../../input";
import { Textarea } from "../../../textarea";
import { CgDetailsLess } from "react-icons/cg";

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
    | "قيد التنفيذ"
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

const updateOrderStatusAPI = async (
  orderId: string,
  status: string,
  acceptedByAdminId: string,
  price?: number,
  priceDetails?: string,
  reason?: string
): Promise<{ success: boolean }> => {
  console.log(
    `[API MOCK] Updating Order ${orderId} to status: ${status}. Accepted By: ${acceptedByAdminId}`
  );

  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true };
};

export const AdminOrderActionCard: React.FC<AdminOrderActionCardProps> = ({
  order,
  onOrderUpdated,
  userRole,
  currentAdminId,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"accept" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [priceInput, setPriceInput] = useState<number | "">("");
  const [priceDetailsInput, setPriceDetailsInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const isAdministrator = userRole === "administrator";

  if (order.status !== "قيد المعالجة") {
    return null;
  }

  async function updateOrderStatusAPI(
    orderId: string,
    newStatus: string,
    adminId: string,
    price?: number,
    priceDetails?: string,
    rejectionReason?: string
  ) {
    try {
      let url = "";
      let body: any = { orderId };

      if (newStatus === "بانتظار الدفع") {
        url = "/api/orders/admin/accept-order";
        body.price = price;
        body.priceDetails = priceDetails;
      } else if (newStatus === "مرفوض") {
        url = "/api/orders/admin/reject-order";
        body.reason = rejectionReason;
      } else {
        return { success: false, error: "Invalid status" };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      return await response.json();
    } catch (error) {
      console.error("updateOrderStatusAPI Error:", error);
      return { success: false, error: "Server fetch error" };
    }
  }

  const handleAction = async (newStatus: string) => {
    // --- VALIDATION ---
    if (newStatus === "مرفوض" && !rejectionReason.trim()) {
      alert("يجب إدخال سبب الرفض.");
      return;
    }
    if (
      newStatus === "بانتظار الدفع" &&
      (!priceInput || priceInput <= 0 || !priceDetailsInput.trim())
    ) {
      alert("يجب تحديد سعر صحيح وتفاصيل السعر قبل القبول.");
      return;
    }
    if (newStatus === "مرفوض" && !isAdministrator) {
      alert("ليس لديك صلاحية لرفض الطلبات.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOrderStatusAPI(
        order.id,
        newStatus,
        currentAdminId,
        newStatus === "بانتظار الدفع" ? Number(priceInput) : undefined,
        newStatus === "بانتظار الدفع" ? priceDetailsInput : undefined,
        newStatus === "مرفوض" ? rejectionReason : undefined
      );

      if (result.success) {
        onOrderUpdated(order.id, newStatus);
        setAction(null);
        setRejectionReason("");
        setPriceInput("");
        setPriceDetailsInput("");
        alert(`تم تحديث حالة الطلب #${order.id} إلى: ${newStatus}`);
      } else {
        alert(`فشل في تحديث الطلب. حاول مجددًا.`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrderDetails = () => (
    <div className="p-6 pt-4 text-sm text-gray-700 dark:text-gray-300 border-t border-neutral-200/60 dark:border-neutral-700/60 bg-neutral-50 dark:bg-neutral-800">
      <h4 className="font-bold mb-4 text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
        <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
        تفاصيل الطلب
      </h4>

      <div className="space-y-3">
        {order.user && (
          <div className="py-2 px-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700 shadow-sm">
            <h5 className="font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              بيانات العميل:
            </h5>
            <p className="text-xs">الاسم: {order.user.name}</p>
            <p className="text-xs">البريد: {order.user.email}</p>
            <p className="text-xs">الهاتف: 0{order.user.phone || "غير متاح"}</p>
          </div>
        )}

        <div className="flex justify-between items-center py-2 px-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <span className="flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <IoCalendarOutline className="size-3.5 text-orange-500" />
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
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <IoTimeOutline className="size-3.5 text-red-500" />
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
              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                المواد:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.subject.map((sub, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300 rounded-full shadow-sm"
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
              <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
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
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <IoDocumentOutline className="size-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                      {url.split("/").pop() || `ملف ${i + 1}`}
                    </span>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors duration-200"
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

  const renderActionButtons = () => (
    <div className="flex gap-3 p-1">
      <button
        onClick={() => setAction("accept")}
        disabled={isLoading}
        className="flex-1 py-3 px-4 cursor-pointer rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
      >
        <div className="p-1 bg-white/20 rounded-lg">
          <IoCheckmarkOutline className="size-4" />
        </div>
        <span>قبول الطلب</span>
      </button>
      <button
        onClick={() => setAction("reject")}
        disabled={isLoading || !isAdministrator}
        className={cn(
          "flex-1 py-3 px-4 rounded-xl font-bold cursor-pointer text-sm text-white transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md",
          isAdministrator
            ? "bg-red-600 hover:bg-red-700"
            : "bg-neutral-400 cursor-not-allowed"
        )}
        title={isAdministrator ? "رفض الطلب" : "الصلاحية محصورة بالمشرف"}
      >
        <div
          className={cn(
            "p-1 rounded-lg",
            isAdministrator ? "bg-white/20" : "bg-white/10"
          )}
        >
          <IoCloseOutline className="size-4" />
        </div>
        <span>رفض</span>
      </button>
    </div>
  );

  const renderConfirmationModal = () => {
    if (!action) return null;

    const isRejecting = action === "reject";
    const buttonText = isRejecting ? "تأكيد الرفض" : "تأكيد القبول";
    const modalTitle = isRejecting ? "تأكيد رفض الطلب" : "تحديد السعر والقبول";
    const confirmStatus = isRejecting ? "مرفوض" : "بانتظار الدفع";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6 bg-white dark:bg-neutral-900 border-t border-neutral-200/60 dark:border-neutral-700/60"
      >
        <div className="text-center">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
            {modalTitle}
          </h3>
        </div>

        {!isRejecting && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <IoPricetagOutline className="size-4 text-green-500" />
                </div>
                السعر المطلوب (ر.س)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(Number(e.target.value) || "")}
                  placeholder="أدخل السعر الإجمالي"
                  required
                  min="1"
                  className="w-full p-3 border border-indigo-400 dark:border-indigo-700 rounded-xl text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 
                              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ﷼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CgDetailsLess className="size-4 text-blue-500" />
                </div>
                تفاصيل السعر
              </label>
              <Textarea
                value={priceDetailsInput}
                onChange={(e) => setPriceDetailsInput(e.target.value)}
                placeholder="أدخل تفاصيل احتساب السعر (رسوم، مواد، إلخ.)"
                rows={3}
                required
                className="w-full p-3 border border-indigo-400 dark:border-indigo-700 rounded-xl text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        )}

        {isRejecting && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <IoAlertCircleOutline className="size-4 text-red-500" />
              </div>
              سبب الرفض
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="أدخل سبب الرفض هنا..."
              rows={4}
              required
              className="w-full p-3 border border-red-400 dark:border-red-700 rounded-xl text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setAction(null)}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl text-sm border hover:cursor-pointer  border-neutral-400 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200 disabled:opacity-50 font-semibold"
          >
            إلغاء
          </button>
          <button
            onClick={() => handleAction(confirmStatus)}
            disabled={
              isLoading ||
              (isRejecting && !rejectionReason.trim()) ||
              (!isRejecting && (!priceInput || !priceDetailsInput.trim()))
            }
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-white text-sm hover:cursor-pointer transition-all duration-200 disabled:opacity-50 shadow-md",
              isRejecting
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري التنفيذ...
              </div>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-2xl border overflow-hidden w-full text-right bg-white dark:bg-neutral-900 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm",
        isHovered
          ? "border-indigo-400/50"
          : "border-neutral-200 dark:border-neutral-800"
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
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl ml-3">
            <IoHourglassOutline className="size-5 text-amber-500" />
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
            قيد الانتظار
          </span>
        </div>
      </div>

      <div
        onClick={() => setShowDetails(!showDetails)}
        className="flex justify-between items-center p-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-all duration-200 group"
      >
        <div className="flex items-center gap-2">عرض التفاصيل الكاملة</div>
        <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-105 transition-all duration-300 transform-gpu">
          <div
            className={`transition-all duration-300 transform-gpu ${
              showDetails ? "rotate-180" : "rotate-0"
            }`}
          >
            <IoChevronDownOutline className="size-4" />
          </div>
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
          {renderOrderDetails()}
        </motion.div>
      )}

      {action ? (
        renderConfirmationModal()
      ) : (
        <div className="p-6">
          <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
              {order.description || "لا يوجد وصف متاح للطلب."}
            </p>
          </div>
          {renderActionButtons()}
        </div>
      )}
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
      console.log("Fetching orders from API...");
      const res = await fetch("/api/orders/admin/get-orders");

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch orders: ${res.status} - ${errorText}`);
      }

      const data: Order[] = await res.json();
      console.log("Orders fetched successfully:", data);
      console.log("Number of orders:", data.length);
      setOrders(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err instanceof Error ? err.message : "فشل في جلب الطلبات من السيرفر."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderUpdate = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="col-span-full text-center p-10 rounded-xl">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            جاري تحميل الطلبات ...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center p-10 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-300 dark:border-red-800">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">
            خطأ في الاتصال
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium"
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
                  لا توجد طلبات حالياً
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                  لم يتم العثور على أي طلبات في النظام. عند تقديم طلبات جديدة،
                  ستظهر هنا تلقائياً.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return orders.map((order) => (
      <AdminOrderActionCard
        key={order.id}
        order={order}
        onOrderUpdated={handleOrderUpdate}
        userRole={currentRole}
        currentAdminId={currentAdminId}
      />
    ));
  };

  return (
    <div dir="rtl" className="  p-6 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              الطلبات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {orders.length > 0
                ? `عرض ${orders.length} طلب${orders.length > 1 ? "ات" : ""}`
                : " طلبات العملاء"}
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
