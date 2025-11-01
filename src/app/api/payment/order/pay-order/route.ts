import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const adminId = session?.user?.id;

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "رقم الطلب مطلوب" },
        { status: 400 }
      );
    }

    // تحديث حالة الطلب
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: "قيد التنفيذ",
      },
    });

    // تسجيل الحدث في سجل الطلب
    await db.orderTracking.create({
      data: {
        orderId: orderId,
        event: "تأكيد الدفع",
        description: `تم تأكيد الدفع وبدء تنفيذ الطلب`,
        performedBy: adminId,
      },
    });

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 }
    );

  } catch (error) {
    console.error("[CONFIRM_PAYMENT]", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
