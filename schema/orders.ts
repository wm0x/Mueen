import z from "zod";

const dateSchema = z
.custom<Date>(
  (val) =>
    val instanceof Date ||
    (typeof val === "string" && !isNaN(Date.parse(val))),
  "يجب اختيار تاريخ صحيح"
)
.refine(
  (date) => {
    const now = new Date();
    return date >= now;
  },
  {
    message: "التاريخ غير صحيح !!",
  }
);

export const UploadOrder = z.object({
    title: z.string().min(5, "عنوان الطلب يجب أن يحتوي على 5 أحرف على الأقل"),
    subject: z.array(z.string()).min(1, "يجب اختيار مادة واحدة على الأقل"),
    description: z.string().optional(),
    files: z.array(z.any()).min(1, "يجب رفع ملف واحد على الأقل"), // For new file uploads
    fileUrls: z.array(z.string()).optional(), // For existing URLs from Supabase
    deadline: dateSchema,
  });