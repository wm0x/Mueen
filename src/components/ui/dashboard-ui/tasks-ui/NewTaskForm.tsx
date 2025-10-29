"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "../../button";
import { InteractiveHoverButton } from "./interactive-hover-button";
import UploadTaskForm from "./UploadTaskForm";
import { Label } from "../../label";
import { Checkbox } from "../../checkbox";

const infoSections = [
  {
    key: "guarantee",
    triggerText: "ماذا يضمن لي مُعين؟",
    title: "الضمان الذهبي في مُعين",
    content: [
      "نحرص على تقديم عمل متقن ومتوافق تمامًا مع المتطلبات التي تزودنا بها.",
      "التنفيذ يكون بجودة عالية وعلى أكمل وجه مع مراعاة أدق التفاصيل.",
      "العمل المقدم يكون خاص فيك فقط ولا يتم تكراره أو إعادة استخدامه.",
      "نسلم العمل في الوقت المحدد أو قبل الموعد المتفق عليه قدر الإمكان.",
      "في حال عدم الالتزام بالشروط المتفق عليها يحق لك طلب استرجاع كامل المبلغ.",
    ],
  },

  {
    key: "pricing",
    triggerText: "كيف يتم تحديد سعر الخدمة؟",
    title: "آلية تسعير الخدمات في مُعين",
    content: [
      "يتم تحديد السعر بناءً على عدة نقاط: مدة التنفيذ، مستوى الصعوبة، حجم المشروع أو الواجب، وأوقات الضغط.",
      "في حال رغبتك بإضافة أو تعديل شيء خارج نطاق الاتفاق يتم احتسابه كمهمة إضافية وبشكل واضح.",
      "كل طلب يتم تسعيره بشكل مستقل لأنه يختلف في التفاصيل والاحتياجات.",
      "نراجع طلبك بدقة ثم نرسل لك السعر واضح وبالتفاصيل قبل البدء.",
      "السعر المتفق عليه هو النهائي ولا توجد رسوم إضافية .",
    ],
  },

  {
    key: "important-info",
    triggerText: "معلومات هامة",
    title: "تنبيهات مهمة قبل تقديم الطلب",
    content: [
      "العمل الذي يتم تقديمه لك يكون خاص بك ومصمم حسب طلبك فقط.",
      "يرجى عدم مشاركة العمل أو إعادة بيعه فقد يترتب على ذلك مشكلات لك .",
      "من الأفضل أن تطّلع على المشروع أو الواجب وتكون على دراية كاملة بتفاصيله.",
      "قد يتم سؤالك من قِبل الدكتور عن بعض الأجزاء وعدم معرفتك بها قد يؤثر على تقييمك.",
      "لضمان تنفيذ دقيق وسريع يُفضل تزويدنا بجميع المتطلبات بشكل واضح من البداية.",
      "هدفنا مساعدتك بشكل فعّال وأن تستفيد من العمل وتحقق نتيجة مميزة بإذن الله.",
    ],
  },
];

function NewTaskForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [openDialogKey, setOpenDialogKey] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleButtonClick = () => {
    if (!isChecked) {
      setShowError(true);
      return;
    }
    setShowError(false);
    handleNextClick();
  };

  const handleNextClick = () => {
    setCurrentStep(2);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (currentStep === 2) {
    return <UploadTaskForm />;
  }

  return (
    <div dir="rtl" className="">
      <div className="p-4 md:p-12 mb-10">
        <div className="border-4 max-w-5xl p-12 rounded-2xl bg-white/5 mx-auto my-auto">
          <div className="flex items-center gap-3 mb-8  w-full text-center justify-center">
            <img
              src={"/mueen.png"}
              alt={"logo"}
              width={65}
              height={65}
              className="dark:invert"
            />
            <span className="text-4xl font-bold text-black dark:text-white ">
              مُــــــعِــــــيــــــن
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300 text-center mb-10">
            أبرز النقاط التي يجب عليك معرفتها قبل رفع الطلب
          </h1>

          <div className="flex flex-wrap sm:flex-row gap-6 w-full text-center justify-between max-w-5xl mx-auto">
            {infoSections.map((section) => (
              <Dialog
                key={section.key}
                open={openDialogKey === section.key}
                onOpenChange={(isOpen) =>
                  setOpenDialogKey(isOpen ? section.key : null)
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="flex-1 min-w-[250px] bg-transparent backdrop-blur-sm cursor-pointer hover:bg-white/20
                                dark:hover:bg-black/20
                                text-black dark:text-white 
                                border-4 border-gray-400 dark:border-white/50 
                                p-12 rounded-2xl text-xl font-bold transition duration-300 shadow-xl"
                  >
                    {section.triggerText}
                  </Button>
                </DialogTrigger>

                <DialogOverlay className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300" />

                <DialogContent
                  className="fixed z-50 top-1/2 left-1/2 w-full max-w-3xl p-10  -translate-x-1/2 -translate-y-1/2 
                             bg-white dark:bg-neutral-900 
                             border border-teal-300 dark:border-teal-700 
                             rounded-xl  shadow-2xl"
                >
                  <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-teal-200 dark:border-teal-700">
                    <div className="mb-4">{section.title}</div>
                  </DialogTitle>

                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                    {Array.isArray(section.content) ? (
                      section.content.map((point, index) => (
                        <p key={index} className="text-start">
                          {index + 1} - {point}
                        </p>
                      ))
                    ) : (
                      <p>{section.content}</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-center ">
            <div className="flex flex-row">
              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-yellow-600 has-[[aria-checked=true]]:bg-yellow-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                  id="toggle-2"
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    setIsChecked(checked === true);
                    if (checked === true) setShowError(false);
                  }}
                  className="data-[state=checked]:border-yellow-600 data-[state=checked]:bg-yellow-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm text-muted-foreground">
                    أقر بأنني قد اطلعت على{" "}
                    <span className="text-blue-500">
                      الشروط والأحكام
                    </span>{" "}
                    وأوافق عليها
                  </p>
                </div>
              </Label>
            </div>

            <InteractiveHoverButton
              className="text-2xl mt-4 "
              dir="rtl"
              onClick={handleButtonClick}
            >
              التالي
            </InteractiveHoverButton>
          </div>

          {/* رسالة الخطأ */}
          <div className="mt-4">
            {showError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                يرجى الموافقة أولاً !
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTaskForm;
