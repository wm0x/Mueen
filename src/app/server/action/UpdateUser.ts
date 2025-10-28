"use server";

import { db } from "@/lib/db";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { UpdateUserInfo } from "../../../../schema/users";

export const UpdateUser = async (values: z.infer<typeof UpdateUserInfo>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "غير مصرح لك بتنفيذ هذا الإجراء" };
  }

  try {
    const { fullName, email, password } = values;

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return { error: "المستخدم غير موجود" };
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }],
        NOT: { id: session.user.id },
      },
    });

    if (existingUser) {
      return { error: "البريد الإلكتروني مستخدم مسبقًا" };
    }

    const updateData: any = {
      name: fullName,
      email,
    };

    if (password && password.length >= 8) {
      //this for check the pass is not same crrently password
      const isSamePassword = await bcrypt.compare(
        password,
        currentUser.password_hash
      );
      if (isSamePassword) {
        return { error: "كلمة المرور الجديدة لا يمكن أن تكون نفس الحالية" };
      }
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: "تم تحديث البيانات بنجاح" };
  } catch (err) {
    console.error("[UPDATE_USER]", err);
    return { error: "حدث خطأ أثناء تحديث البيانات" };
  }
};
