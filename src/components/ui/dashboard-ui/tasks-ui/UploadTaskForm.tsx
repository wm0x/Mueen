"use client";
import React, { useState, useTransition } from "react";
import FadeContent from "./fade";
import { Input } from "../../input";
import { Textarea } from "../../textarea";
import { MultiSelect } from "./multi-select";
import { StatefulButton } from "./stateful-button";
import { DatetimePicker } from "./date-picker";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileDropzone } from "./Droppable";
import { UploadOrderAction } from "@/app/server/action/orders";
import { supabase } from "@/lib/supabase";

const ClassList = [
  ...[
    "برمجة ١",
    "برمجة ٢",
    "برمجة ٣",
    "خوارزميات وتعقيد",
    "رسومات حاسب",
    "هندسة برمجيات",
    "ذكاء اصطناعي",
    "البرمجة فالذكاء الاصطناعي",
    "التعلم العميق",
    "تعلم الاله",
    "برمجة محرك اللعبه",
    "نظم معلومات",
    "شبكات حاسب",
    "قواعد بيانات",
    "تحليل وتصميم كينوني",
    "ادارة وتنظيم شبكات",
    "امن حاسب",
    "امن معلومات",
    "وسائط متعدده",
    "معمارية النظم",
  ].map((item) => ({ value: item, label: item })),
];

function UploadTaskForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [buttonStatus, setButtonStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async () => {
    setSuccess("");
    setError("");
    try {
      setButtonStatus("loading");
  
      // here upload the file from front end ..
      const files = form.getValues().files;
      const uploadedUrls: string[] = [];
  
      for (const file of files) {
        const filePath = `orders/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from("orders")
          .upload(filePath, file);
  
        if (error) {
          console.error(error);
          setButtonStatus("error");
          setError(`فشل رفع الملف: ${file.name}`);
          return;
        }
  
        const { data: publicData } = supabase.storage
          .from("orders")
          .getPublicUrl(filePath);
  
        if (!publicData?.publicUrl) {
          setButtonStatus("error");
          setError(`فشل الحصول على رابط الملف: ${file.name}`);
          return;
        }
  
        uploadedUrls.push(publicData.publicUrl);
      }
  
      const result = await UploadOrderAction({
        ...form.getValues(),
        fileUrls: uploadedUrls,
        files: [], 
      });
  
      if (result.error) {
        setButtonStatus("error");
        setSuccess(result.error);
        return;
      }
  
      setButtonStatus("success");
      setSuccess(result.success);
    } catch (err) {
      console.error(err);
      setButtonStatus("error");
      setError("حدث خطأ أثناء إنشاء الطلب");
    }
  };
  

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
        message: " لا يمكن ان يكون التاريخ قديم ",
      }
    );

  const UploadOrder = z.object({
    title: z.string().min(5, "عنوان الطلب يجب أن يحتوي على 5 أحرف على الأقل"),
    subject: z.array(z.string()).min(1, "يجب اختيار مادة واحدة على الأقل"),
    description: z.string().optional(),
    files: z.array(z.any()).min(1, "يجب رفع ملف واحد على الأقل"), 
    fileUrls: z.array(z.string()).optional(), 
    deadline: dateSchema,
  });

  type UploadOrderType = z.infer<typeof UploadOrder>;

  const form = useForm<UploadOrderType>({
    resolver: zodResolver(UploadOrder),
    defaultValues: {
      title: "",
      subject: [],
      description: "",
      files: [], 
      fileUrls: [], 
      deadline: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof UploadOrder>) => {
    try {
      console.log(values);
    } catch (error) {
      console.error("Form submission error", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-center">
          <div
            className="flex md:flex-row flex-col justify-center items-center gap-3 mb-4 w-full text-center md:justify-between mt-4 px-10"
            dir="rtl"
          >
            <div className="flex  text-center items-center">
              <img
                src={"/mueen.png"}
                alt={"logo"}
                width={95}
                height={95}
                className="dark:invert -mr-10 md:-mr-0"
              />
              <span className="text-5xl font-bold text-black dark:text-white ">
                مُــــــعِــــــيــــــن
              </span>
            </div>
            <div className="flex items-center text-center">
              <h2 className="text-3xl font-bold dark:text-white mb-4 ">
                نموذج طلب واجب / مشروع
              </h2>
            </div>
          </div>
          <div className="p-6 w-full h-full max-w-2xl pb-24">
            <FadeContent
              blur={true}
              duration={400}
              easing="ease-out"
              initialOpacity={0}
            >
              <div className="text-center p-8 mx-auto flex flex-col items-center justify-center rounded-xl space-y-8">
                <div
                  className="flex flex-col w-full text-start space-y-8"
                  dir="rtl"
                >
                  <div className="space-y-3">
                    <h1 className="text-lg font-medium mb-3">
                      عنوان المشروع أو الواجب
                    </h1>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="مشروع برمجة (٣)"
                              dir="rtl"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3" dir="rtl">
                    <h1 className="text-lg font-medium mb-3">المقرر </h1>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <MultiSelect
                              options={ClassList}
                              value={field.value || []} // Use field.value directly
                              onValueChange={field.onChange} // No need for separate state
                              placeholder="اختر المقرر (يمكن اختيار أكثر من مقرر)"
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3 w-full" dir="rtl">
                    <h1 className="text-lg font-medium mb-3">
                      تاريخ ووقت التسليم النهائي
                    </h1>
                    <div className=" flex items-center justify-center w-full">
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full items-center justify-center">
                            <DatetimePicker
                              value={field.value}
                              onChange={field.onChange}
                              format={[
                                ["days", "months", "years"],
                                ["hours", "minutes", "am/pm"],
                              ]}
                            />
                            <FormMessage className="text-center w-full" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-full w-full" dir="rtl">
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <FormControl className="h-full">
                          <div className="h-full w-full p-4">
                            <FileDropzone
                              value={field.value || []}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-3 w-full" dir="rtl">
                  <div className="flex items-center space-x-2" dir="rtl">
                    <h1 className="text-lg font-medium mb-3">
                      تفاصيل وملاحظات إضافية
                    </h1>
                    <h1 className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-3">
                      (اختياري)
                    </h1>
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <FormControl className="h-full">
                          <div className="h-full w-full p-4">
                            <Textarea
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="الرجاء كتابة جميع التفاصيل والمتطلبات الخاصة بالمشروع هنا."
                              className="min-h-32 max-h-40 w-full resize-vertical"
                              id="message"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  {error && (
                    <div className="mb-3">
                      <div
                        dir="rtl"
                        className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300"
                      >
                        <p className="font-semibold text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="mb-3">
                      <div
                        dir="rtl"
                        className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/50 border border-green-400 text-green-700 dark:text-green-300"
                      >
                        <p className="font-semibold text-sm">{success}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="flex w-full items-center justify-center pt-4"
                  dir="rtl"
                >
                  <StatefulButton
                    onClick={() => form.handleSubmit(handleSubmit)()}
                    type="button"
                    className="dark:bg-teal-500"
                  >
                    إرسال الطلب
                  </StatefulButton>
                </div>
              </div>
            </FadeContent>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default UploadTaskForm;
