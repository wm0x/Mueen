"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { auth } from "@/auth";
import { UploadOrder } from "../../../../schema/orders";

export const UploadOrderAction = async (
  values: z.infer<typeof UploadOrder>
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك بتنفيذ هذا الإجراء" };

  try {
    const { title, subject, description, fileUrls, deadline } = values;
    const userId = session.user.id;

    const order = await db.order.create({
      data: {
        title,
        description: description || "",
        filesUrls: fileUrls || [],
        subject: subject,
        deadline,
        userId,
      },
    });

    await db.orderTracking.create({
      data: {
        orderId: order.id,
        event: "إنشاء طلب جديد",
        description: `تم إنشاء طلب بعنوان: ${title}`,
        performedBy: userId,
      },
    });

    return { success: "تم إنشاء الطلب بنجاح", order };
  } catch (err) {
    console.error("[UPLOAD_ORDER]", err);
    return { error: (err as Error).message || "حدث خطأ أثناء رفع الطلب" };
  }
};
