"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { getUserByEmail } from "../../../../data/user";

const LoginSchema = z.object({
  email: z.email("يرجى إدخال البريد الإلكتروني"),
  password: z.string().min(1, "يرجى إدخال كلمة المرور"),
});

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    return { error: "يرجى التأكد من صحة البيانات المدخلة" };
  }

  const { email, password } = validated.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "بيانات الدخول غير صحيحة." };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordCorrect) {
    console.log("error there in password");
    return { error: "بيانات الدخول غير صحيحة." };
  }

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
    callbackUrl: DEFAULT_LOGIN_REDIRECT,
  });
  if (result?.error) {
    return { error: "فشل في تسجيل الدخول. حاول مرة أخرى." };
  }

  console.log(user);
  return { success: true, redirectUrl: DEFAULT_LOGIN_REDIRECT };
};
