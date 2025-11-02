import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const adminId = session?.user?.id;
    const role = session?.user?.role;

    const allowedRoles = ["admin", "administrator"];
    if (!adminId || !allowedRoles.includes(role || "")) {
      return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });
    }

    const { orderId, finalFileUrl: newSolutionUrls } = await req.json();

    if (!orderId || !Array.isArray(newSolutionUrls) || newSolutionUrls.length === 0) {
      return NextResponse.json(
        { error: "orderId و finalFileUrl (مصفوفة) مطلوبة." },
        { status: 400 }
      );
    }
    
    const updatedOrder = await db.order.update({
      where: { id: orderId, acceptedByAdminId: adminId }, 
      data: {
        status: "مكتمل",
        fileSolution: {
          push: newSolutionUrls, 
        },
      },
    });

    await db.orderTracking.create({
      data: {
        orderId: orderId,
        event: "إكمال الطلب والحل النهائي", 
        description: `تم إكمال الطلب بنجاح ورفع ${newSolutionUrls.length} ملف حل نهائي.`,
        performedBy: adminId,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error("[POST_COMPLETE_ORDER_ERROR]", error);
    return NextResponse.json({ error: "خطأ في الخادم أثناء إنهاء الطلب" }, {
      status: 500,
    });
  }
}
