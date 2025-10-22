import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { SignInUser } from "../../../../../schema/Authentication";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SignInUser.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "الرجاء التحقق من صحة البيانات." }, { status: 400 });
    }

    const { phone, email, password, name } = validated.data;

    const existingEmail = await db.user.findFirst({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل." }, { status: 400 });
    }

    const existingPhone = await db.user.findFirst({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ error: "رقم الهاتف مستخدم بالفعل." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        phone,
        email,
        name,
        password_hash: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, redirectUrl: DEFAULT_LOGIN_REDIRECT });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
