import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const adminId = session?.user?.id;
    const role = session?.user?.role ?? "";

    if (!adminId || !["admin", "administrator"].includes(role)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }

    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: {
        status: "مرفوض",
        rejectionReason: reason || "لا يوجد سبب مذكور",
        acceptedByAdminId: adminId,
      },
    });

    await db.orderTracking.create({
      data: {
        orderId,
        event: "رفض الطلب",
        description: reason || "تم رفض الطلب بدون ذكر سبب",
        performedBy: adminId,
      },
    });

    return NextResponse.json(
      { message: "تم رفض الطلب وتسجيل الحدث", order },
      { status: 200 }
    );

  } catch (error) {
    console.log("[REJECT_ORDER]", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء رفض الطلب" },
      { status: 500 }
    );
  }
}
