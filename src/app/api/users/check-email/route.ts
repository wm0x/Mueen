// src/app/api/users/check-email/route.ts
import { db } from "@/lib/db";

export const runtime = "nodejs"; // مهم Prisma

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const user = await db.user.findFirst({ where: { email } });
    return new Response(JSON.stringify({ exists: !!user }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
