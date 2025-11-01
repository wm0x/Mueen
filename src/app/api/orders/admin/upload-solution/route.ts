import { db } from "@/lib/db"; 
import { auth } from "@/auth"; 

export const runtime = "nodejs";

export async function POST(req: Request) {
    const session = await auth();
    const adminId = session?.user?.id;
    const role = session?.user?.role;

    if (!adminId || (role !== "admin" && role !== "administrator")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { orderId, finalFileUrl } = await req.json();

    if (!orderId || !finalFileUrl) {
        return new Response(
            JSON.stringify({ error: "Order ID and final file URL are required." }),
            { status: 400 }
        );
    }

    try {
        const currentOrder = await db.order.findUnique({
            where: { id: orderId },
            select: { status: true, acceptedByAdminId: true }
        });

        if (!currentOrder) {
            return new Response(JSON.stringify({ error: "Order not found." }), { status: 404 });
        }
        
        if (currentOrder.status !== "جاري العمل عليه") {
            return new Response(
                JSON.stringify({ error: `Order is not in the 'جاري العمل عليه' status (current status: ${currentOrder.status}).` }),
                { status: 400 }
            );
        }
        
        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: {
                status: "مكتمل",
            },
        });

        await db.orderTracking.create({
            data: {
                orderId: orderId,
                event: "إكمال الطلب",
                description: `تم إنهاء الطلب وإرسال ملف الحل النهائي: ${finalFileUrl}`,
                performedBy: adminId,
            },
        });

        return new Response(
            JSON.stringify({ success: true, order: updatedOrder }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Complete Order API Error:", error);
        return new Response(JSON.stringify({ error: "Internal server error during database operation." }), {
            status: 500,
        });
    }
}
