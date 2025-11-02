import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      where: {
        acceptedByAdminId: null,   
        isDeleted: false           
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { createdAt: "desc" } 
    });

    await db.order.updateMany({
      where: {
        isAdminViewed: false,
      },
      data: { isAdminViewed: true },
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
