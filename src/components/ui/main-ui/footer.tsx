import React from "react";
import ThemeSwitcherButton from "./Theme";
import { BsDiscord } from "react-icons/bs";

function Footer() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-teal-50/40 to-white dark:from-[#0f1717] dark:via-[#0f1717]/80 dark:to-[#0f1717] mt-20 rounded-4xl" dir="rtl">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 dark:via-teal-500 to-transparent shadow-[0_0_25px_5px_rgba(20,184,166,0.4)]"></div>

      <footer className="w-full pt-20 pb-12 text-black dark:text-gray-200 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div
            className={`flex flex-col items-center md:items-start gap-4 text-center `}
          >
            <div className="flex items-center gap-3 mb-4 w-full text-center justify-center">
              <img
                src={"/mueen.png"}
                alt={"logo"}
                width={45}
                height={45}
                className="dark:invert"
              />
              <span className="text-2xl font-bold text-black dark:text-white ">
                مُــــــعِــــــيــــــن
              </span>
            </div>
            <p className="text-black/70 dark:text-gray-400 max-w-xl leading-relaxed text-center justify-center">
              مُعين منصة تحت نخبة طلاب كلية الحاسبات لتقديم المساعده للطلاب في
              حل الواجبات وتنفيذ المشاريع وإعداد العروض التقديمية ومساعدتهم على
              إنجاز مهامهم بسرعة وكفاءة
            </p>
            <div className="flex flex-col w-full justify-center items-center">
              <ThemeSwitcherButton />
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-4 md:mt-5">
            <h4 className="text-sm font-black border-b-4 rounded border-green-500 dark:border-teal-500 text-black/80 dark:text-gray-200 tracking-wider mb-3">
              اكتشف
            </h4>
            <div className={`flex flex-col gap-3 text-center`}>
              <div className="text-black/70 dark:text-gray-400 hover:text-green-600 dark:hover:text-teal-400 text-sm transition-colors">
                تواصل معنا
              </div>
              <div className="text-black/70 dark:text-gray-400 hover:text-green-600 dark:hover:text-teal-400 text-sm transition-colors">
                من نحن
              </div>
              <div className="text-black/70 dark:text-gray-400 hover:text-green-600 dark:hover:text-teal-400 text-sm transition-colors">
                خدماتنا
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 mt-5">
            <h4 className="text-sm font-black border-b-4 rounded dark:border-teal-500 border-green-500 text-black/80 dark:text-gray-200 tracking-wider">
              تابعنا
            </h4>
            <div className="flex gap-5 text-black/60 dark:text-gray-400">
              <div className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                <BsDiscord size={22} />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-6 text-center text-sm text-black/60 dark:text-gray-500 border-t border-black/5 dark:border-white/10">
          كل الحقوق محفوظة مُــــــعِــــــيــــــن ©
          {new Date().getFullYear()}
        </div>

      </footer>

      {/* Background wordmark */}
      <div className="w-full items-center text-center justify-center">
        <h1 className="text-4xl md:text-7xl p-2 font-bold bg-gradient-to-b from-green-600 to-white dark:from-teal-400 dark:to-gray-900 bg-clip-text text-transparent opacity-30">
          مُــــــــــــــــعِــــــــــــــــيــــــــــــــــن
        </h1>
      </div>
    </div>
  );
}

export default Footer;
