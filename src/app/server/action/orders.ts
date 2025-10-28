"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import { auth } from "@/auth";
import { UploadOrder } from "../../../../schema/orders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * UploadOrderAction
 * رفع طلب جديد مع ملفات متعددة إلى Supabase وحفظه في قاعدة البيانات
 */
export const UploadOrderAction = async (values: z.infer<typeof UploadOrder>) => {
  // التحقق من تسجيل دخول المستخدم
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "غير مصرح لك بتنفيذ هذا الإجراء" };
  }

  try {
    const { title, subject, description, files, fileUrls, deadline } = values;
    const userId = session.user.id;

    console.log("User input values:", values);

    const uploadedUrls: string[] = [];

    // رفع الملفات إلى Supabase
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const fileName = `${userId}/${Date.now()}_${file.name}`;
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          // رفع الملف
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("orders")
            .upload(fileName, uint8Array);

          if (uploadError || !uploadData) {
            throw new Error(
              `فشل رفع الملف: ${file.name}, ${uploadError?.message || ""}`
            );
          }
          const { data: publicData } = supabase.storage
            .from("orders")
            .getPublicUrl(fileName);

          const publicUrl = publicData?.publicUrl;
          if (!publicUrl) {
            throw new Error(`فشل الحصول على رابط الملف العام: ${file.name}`);
          }

          uploadedUrls.push(publicUrl);
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
    }

    const allFileUrls = [...(fileUrls || []), ...uploadedUrls];
    const order = await db.order.create({
      data: {
        title,
        description: description || "",
        filesUrls: allFileUrls,
        subject: subject,
        deadline,
        userId,
      },
    });
    return { success: "تم إنشاء الطلب بنجاح", order };
  } catch (err) {
    console.error("[UPLOAD_ORDER]", err);
    return { error: (err as Error).message || "حدث خطأ أثناء رفع الطلب" };
  }
};
