// src/app/api/orders/admin/accept-order/route.ts
import { db } from "@/lib/db";
import { auth } from "@/auth";

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
      

    const { orderId, price } = await req.json();

    if (!orderId || !price) {
      return new Response(
        JSON.stringify({ error: "orderId and price are required" }),
        { status: 400 }
      );
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        acceptedByAdminId: adminId,
        status: "بانتظار الدفع",
        price: price,
      },
    });

    await db.orderTracking.create({
      data: {
        orderId: orderId,
        event: "قبول الطلب",
        description: `تم قبول الطلب وتحديد السعر ${price}`,
        performedBy: adminId,
      },
    });

    await db.orderTracking.create({
      data: {
        orderId: orderId,
        event: "بانتظار الدفع",
        description: `تم تغيير حالة الطلب الى في انتظار الدفع ${price}`,
        performedBy: adminId,
      },
    });

    return new Response(
      JSON.stringify({ success: true, order: updatedOrder }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
