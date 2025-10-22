"use client";

import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}


const questions: FAQItem[] = [
  {
    question: "ما هي منصة مُــعِــيــن؟",
    answer:
      "منصة مُــعِــيــن هي منصة طلابية من كلية الحاسبات بجامعة الملك عبدالعزيز تهدف إلى مساعدة الطلاب في مشاريع المواد الدراسية      .",
  },
  {
    question: "من يدير منصة مُــعِــيــن؟",
    answer:
      "تُدار المنصة بالكامل من قِبَل ٧ طلاب من كلية الحاسبات، حيث يوجد ٢ من قسم علوم الحاسب، و٣ من تقنية المعلومات، و٢ من نظم المعلومات.",
  },
  {
    question: "هل المنصة مخصصة لطلاب جامعة الملك عبدالعزيز فقط؟",
    answer:
      "في الوقت الحالي المنصة موجهة بشكل أساسي لطلاب كلية الحاسبات بجامعة الملك عبدالعزيز ، ولكن لا يمنع من طلاب الجامعات الاخرى ارسال استفساراتهم .",
  },
  {
    question: "كيف يمكنني التسجيل في المنصة؟",
    answer:
      "يمكنك التسجيل بسهولة عبر الضغط على زر التسجيل في الصفحة الرئيسية وملء البيانات المطلوبة مثل البريد وكلمة المرور.",
  },
  {
    question: "هل يمكنني الحصول على مساعدة في المشاريع الجامعية؟",
    answer:
      "نعم! فريق مُــعِــيــن يقدم المساعدة في تنفيذ المشاريع الجامعية بالطريقة الصحيحة التي تساعدك على الحصول على الدرجة الكاملة .",
  },
  {
    question: "ما هي المواد التي يمكن لمُــعِــيــن المساعدة فيها؟",
    answer:
      "نغطي مجموعة واسعة من المواد مثل البرمجة، قواعد البيانات، الخوارزميات، الذكاء الاصطناعي، هندسة البرمجيات، وغيرها من مواد كلية الحاسبات.",
  },
  {
    question: "هل المنصة مجانية؟",
    answer:
      "لا المنصة تقدم خدماتها بمقابل.",
  },
  {
    question: "هل هناك دعم فني أو قناة تواصل مباشرة؟",
    answer:
      "بالطبع، يمكنك التواصل معنا عبر طرق التواصل .",
  },
];



const AskItem: React.FC<FAQItem> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mb-4 transition-all duration-300 hover:shadow-lg rounded-3xl z-[40] ">
      <div
        className={`flex items-center justify-between p-6 cursor-pointer 
        bg-gradient-to-r from-teal-50 to-white 
        dark:from-[#064E3B] dark:to-[#0F766E]
        rounded-3xl shadow-sm transition-all duration-300 
        hover:from-teal-100 hover:to-teal-50 dark:hover:from-[#115E59] dark:hover:to-[#134E4A]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`flex-1 font-bold text-lg text-teal-900 dark:text-teal-100`}
        >
          {question}
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-[#134E4A] shadow-md flex items-center justify-center">
          {isOpen ? (
            <FaMinus className="text-teal-700 dark:text-teal-200 text-sm" />
          ) : (
            <FaPlus className="text-teal-500 dark:text-teal-50 text-sm" />
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className={`mt-2 p-6 bg-white dark:bg-[#065F46] rounded-2xl shadow-inner border border-teal-100 dark:border-teal-700 animate-fadeIn `}
        >
          <p className="text-teal-800 dark:text-teal-100 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const Asks: React.FC = () => {
  return (
    <div className="relative flex flex-col size-full items-center justify-center rounded-2xl ">
      <div className="inset-0 z-0 overflow-hidden rounded-xl w-full">
        <div className="pointer-events-none absolute inset-0 flex rounded-2xl items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_100%,black)] bg-[#1d1d1d] dark:bg-[#022C22]"></div>
        <div className="py-12 px-4 md:px-8 rounded-4xl w-full relative">
          <div className={`text-center mb-12 `}>
            <h2 className="text-3xl md:text-4xl font-bold text-teal-950 dark:text-white mb-4">
              {"الأسئلة الشائعة"}
            </h2>
            <p className="text-gray-700 dark:text-gray-100 max-w-2xl mx-auto">
              {
                "لديك استفسار عن فِكر؟ ربما تجد الإجابة هنا. إذا لم تجد ما تبحث عنه، لا تتردد في التواصل معنا"
              }
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4">
            {questions.map((item, index) => (
              <AskItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default Asks;
