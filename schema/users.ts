import z from "zod";

export const UpdateUserInfo = z.object({
    fullName: z
      .string()
      .min(3, { message: "الاسم يجب أن يحتوي على 3 أحرف على الأقل" }),
    email: z.string().email({ message: "صيغة البريد الإلكتروني غير صحيحة" }),
    password: z
      .string()
      .min(8, { message: "كلمة المرور قصيرة جداً" })
      .optional()
      .or(z.literal("")),
  });
  