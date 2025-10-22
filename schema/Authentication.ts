import * as z from "zod";

const phoneRegex = /^[1-9]\d{8}$/;

export const SignInUser = z.object({
  name: z
    .string()
    .min(3, { message: "تأكد بأن الاسم صحيح" })
    .max(10, { message: "تأكد بأنك أدخلت الاسم الأول فقط" }),

  email: z.email({
    message: "الإيميل غير صحيح",
  }),

  password: z.string().min(4, { message: "كلمة المرور غير كافية" }),

  phone: z
    .string()
    .regex(phoneRegex, {
      message: "رقم الجوال يجب أن يكون 9 أرقام ولا يبدأ بالصفر",
    })
    .length(9, { message: "يجب إدخال 9 أرقام فقط." }),
});

export const LoginUser = z.object({
  email: z.email({
    message: "الإيميل غير صحيح",
  }),

  password: z.string().min(4, { message: "كلمة المرور غير كافية" }),
});
