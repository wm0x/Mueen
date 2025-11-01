import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const adminId = session?.user?.id;
    const role = session?.user?.role;

    const allowedRoles = ["admin", "administrator"];
    if (!adminId || !allowedRoles.includes(role || "")) {
      return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });
    }

    const orders = await db.order.findMany({
        where: {
            OR: [
              { acceptedByAdminId: adminId } // أنت اللي قبلته
            ],
          },          
      include: {
        user: true,
        acceptedByAdmin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(orders.length)

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error) {
    console.error("[GET_ADMIN_ORDERS_ERROR]", error);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
